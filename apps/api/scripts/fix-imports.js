/**
 * Post-build script to add .js extensions to ESM imports
 * Fixes: ERR_UNSUPPORTED_DIR_IMPORT in Node.js ESM
 * Processes both API and shared packages
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, relative, sep } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Recursively find all .js files in a directory
function findJsFiles(dir, fileList = []) {
  if (!existsSync(dir)) {
    return fileList;
  }
  
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      findJsFiles(filePath, fileList);
    } else if (file.endsWith('.js')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Process both API and shared package dist folders
const dirsToProcess = [
  join(__dirname, '../dist'),           // API dist
  join(__dirname, '../../../packages/shared/dist')  // Shared package dist
];

console.log(`\n🔧 Fixing ESM imports in multiple packages...\n`);

let totalFixedCount = 0;
let totalFilesCount = 0;

dirsToProcess.forEach(distDir => {
  // Skip if directory doesn't exist yet
  if (!existsSync(distDir)) {
    console.log(`⏭️  Skipping (not built yet): ${distDir}\n`);
    return;
  }
  
  console.log(`📂 Processing: ${distDir}\n`);
  
  // Find all .js files in this dist folder
  const files = findJsFiles(distDir);
  totalFilesCount += files.length;

  // Common folder names that might need /index.js (used as fallback only)
  const folderNames = ['config', 'middleware', 'types', 
                      'constants', 'utils', 'errors', 'email', 'schemas',
                      'dto', 'validators'];

  files.forEach(file => {
    let content = readFileSync(file, 'utf8');
    const originalContent = content;
    let modified = false;

    // Fix relative imports AND exports: from './something' or export * from './something'
    content = content.replace(
      /(from|export\s+\*\s+from)\s+['"](\.[^'"]+)['"]/g,
      (match, keyword, importPath) => {
        // Skip if already has extension
        if (importPath.match(/\.(js|json)$/)) return match;
        
        // Resolve the actual path relative to current file
        const currentDir = dirname(file);
        const targetPath = join(currentDir, importPath);
        
        // Check if it's a directory that contains index.js
        if (existsSync(targetPath) && statSync(targetPath).isDirectory()) {
          if (existsSync(join(targetPath, 'index.js'))) {
            modified = true;
            return `${keyword} '${importPath}/index.js'`;
          }
        }
        
        // Check if .js file exists
        if (existsSync(targetPath + '.js')) {
          modified = true;
          return `${keyword} '${importPath}.js'`;
        }
        
        // Fallback: check if last part is a known folder name
        const pathParts = importPath.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        
        if (folderNames.includes(lastPart)) {
          modified = true;
          return `${keyword} '${importPath}/index.js'`;
        }
        
        // Default: add .js
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
        
        // Calculate relative path from current file to dist root
        const currentDir = dirname(file);
        const distRoot = distDir;
        const relPath = relative(currentDir, distRoot);
        const levels = relPath.split(sep).length;
        const prefix = '../'.repeat(levels);
        
        // For path aliases, check what the target would be
        const targetPath = join(distDir, importPath);
        
        // Check if it's a directory with index.js
        if (existsSync(targetPath) && statSync(targetPath).isDirectory()) {
          if (existsSync(join(targetPath, 'index.js'))) {
            modified = true;
            return `from '${prefix}${importPath}/index.js'`;
          }
        }
        
        // Check if .js file exists
        if (existsSync(targetPath + '.js')) {
          modified = true;
          return `from '${prefix}${importPath}.js'`;
        }
        
        // Fallback: use heuristic
        const pathParts = importPath.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        
        if (folderNames.includes(lastPart)) {
          modified = true;
          return `from '${prefix}${importPath}/index.js'`;
        }
        
        modified = true;
        return `from '${prefix}${importPath}.js'`;
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
