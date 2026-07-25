/**
 * Post-build script to add .js extensions to ESM imports
 * Fixes: ERR_UNSUPPORTED_DIR_IMPORT in Node.js ESM
 * Processes both API and shared packages
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Process both API and shared package dist folders
const dirsToProcess = [
  join(__dirname, '../dist'),           // API dist
  join(__dirname, '../../../packages/shared/dist')  // Shared package dist
];

console.log(`\n🔧 Fixing ESM imports in multiple packages...\n`);

let totalFixedCount = 0;
let totalFilesCount = 0;

dirsToProcess.forEach(distDir => {
  console.log(`📂 Processing: ${distDir}\n`);
  
  // Find all .js files in this dist folder
  const files = globSync('**/*.js', { cwd: distDir, absolute: true });
  totalFilesCount += files.length;

  files.forEach(file => {
    let content = readFileSync(file, 'utf8');
    const originalContent = content;
    let modified = false;

    // Common folder names that need /index.js
    const folderNames = ['config', 'middleware', 'db', 'prisma', 'types', 
                        'constants', 'utils', 'errors', 'infra', 'email', 'schemas',
                        'dto', 'validators'];

    // Fix relative imports AND exports: from './something' or export * from './something'
    content = content.replace(
      /(from|export\s+\*\s+from)\s+['"](\.[^'"]+)['"]/g,
      (match, keyword, importPath) => {
        // Skip if already has extension
        if (importPath.match(/\.(js|json)$/)) return match;
        
        // Check if it's likely a directory import
        const pathParts = importPath.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        
        if (folderNames.includes(lastPart)) {
          modified = true;
          return `${keyword} '${importPath}/index.js'`;
        }
        
        // Otherwise add .js
        modified = true;
        return `${keyword} '${importPath}.js'`;
      }
    );

    // Fix path alias imports: from '@/something'
    content = content.replace(
      /from\s+['"]\@\/([^'"]+)['"]/g,
      (match, importPath) => {
        // Skip if already has extension
        if (importPath.match(/\.(js|json)$/)) return match;
        
        // Check if ends with folder name
        const pathParts = importPath.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        
        if (folderNames.includes(lastPart)) {
          modified = true;
          return `from '../${importPath}/index.js'`;
        }
        
        modified = true;
        return `from '../${importPath}.js'`;
      }
    );

    if (modified && content !== originalContent) {
      writeFileSync(file, content, 'utf8');
      const relativePath = file.replace(distDir, '');
      console.log(`  ✓ ${relativePath}`);
      totalFixedCount++;
    }
  });

  console.log('');
});

console.log(`✅ Done! Fixed imports in ${totalFixedCount} files out of ${totalFilesCount} total\n`);

if (totalFixedCount === 0) {
  console.warn('⚠️  Warning: No files were modified. Check if imports are already correct.\n');
}
