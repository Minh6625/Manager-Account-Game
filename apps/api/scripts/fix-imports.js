/**
 * Post-build script to add .js extensions to ESM imports
 * Fixes: ERR_UNSUPPORTED_DIR_IMPORT in Node.js ESM
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '../dist');

// Find all .js files in dist
const files = glob.sync('**/*.js', { cwd: distDir, absolute: true });

files.forEach(file => {
  let content = readFileSync(file, 'utf8');
  let modified = false;

  // Fix: import ... from './config' => import ... from './config/index.js'
  // Fix: import ... from '../path' => import ... from '../path.js'
  content = content.replace(
    /from\s+['"](\.[^'"]+)['"]/g,
    (match, path) => {
      // Skip if already has extension
      if (path.match(/\.(js|json)$/)) return match;
      
      // Check if it's a directory import (ends with folder name)
      if (path.endsWith('/config') || path.endsWith('/middleware') || 
          path.endsWith('/db') || path.endsWith('/prisma') || 
          path.endsWith('/types') || path.endsWith('/constants') ||
          path.endsWith('/utils') || path.endsWith('/errors')) {
        modified = true;
        return `from '${path}/index.js'`;
      }
      
      // Otherwise add .js
      modified = true;
      return `from '${path}.js'`;
    }
  );

  if (modified) {
    writeFileSync(file, content, 'utf8');
    console.log(`✓ Fixed imports in: ${file}`);
  }
});

console.log(`✓ Processed ${files.length} files`);
