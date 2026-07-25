/**
 * Post-build script to add .js extensions to ESM imports
 * Fixes: ERR_UNSUPPORTED_DIR_IMPORT in Node.js ESM
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '../dist');

// Find all .js files in dist
const files = globSync('**/*.js', { cwd: distDir, absolute: true });

console.log(`\n🔧 Fixing ESM imports in ${files.length} files...\n`);

let fixedCount = 0;

files.forEach(file => {
  let content = readFileSync(file, 'utf8');
  const originalContent = content;
  let modified = false;

  // Fix relative imports: from './something' or '../something'
  content = content.replace(
    /from\s+['"](\.[^'"]+)['"]/g,
    (match, importPath) => {
      // Skip if already has extension
      if (importPath.match(/\.(js|json)$/)) return match;
      
      // Check if it's likely a directory import
      const pathParts = importPath.split('/');
      const lastPart = pathParts[pathParts.length - 1];
      
      // Common folder names that need /index.js
      const folderNames = ['config', 'middleware', 'db', 'prisma', 'types', 
                          'constants', 'utils', 'errors', 'infra', 'email'];
      
      if (folderNames.includes(lastPart)) {
        modified = true;
        return `from '${importPath}/index.js'`;
      }
      
      // Otherwise add .js
      modified = true;
      return `from '${importPath}.js'`;
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
      
      const folderNames = ['config', 'middleware', 'db', 'prisma', 'types',
                          'constants', 'utils', 'errors', 'infra', 'email'];
      
      if (folderNames.includes(lastPart)) {
        modified = true;
        // Convert @/ to relative path from dist root
        return `from '../${importPath}/index.js'`;
      }
      
      modified = true;
      return `from '../${importPath}.js'`;
    }
  );

  if (modified && content !== originalContent) {
    writeFileSync(file, content, 'utf8');
    const relativePath = file.replace(distDir, '');
    console.log(`✓ ${relativePath}`);
    fixedCount++;
  }
});

console.log(`\n✅ Done! Fixed imports in ${fixedCount} files out of ${files.length} total\n`);

if (fixedCount === 0) {
  console.warn('⚠️  Warning: No files were modified. Check if imports are already correct or if there is an issue.\n');
}
