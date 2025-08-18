#!/usr/bin/env node

/**
 * Fix JSON syntax issues in node_modules
 * This script removes trailing commas from JSON files that cause validation errors
 */

const fs = require('fs');
const path = require('path');

const filesToFix = [
  'node_modules/hasown/tsconfig.json'
];

function fixJsonFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Remove trailing commas before ] or }
    content = content.replace(/,(\s*])/g, '$1');
    content = content.replace(/,(\s*})/g, '$1');

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed JSON syntax in ${filePath}`);
    }
  } catch (error) {
    console.warn(`⚠️  Could not fix ${filePath}: ${error.message}`);
  }
}

function main() {
  console.log('🔧 Fixing JSON syntax issues in node_modules...');
  
  filesToFix.forEach(file => {
    fixJsonFile(file);
  });

  console.log('✅ JSON fix completed');
}

if (require.main === module) {
  main();
}

module.exports = { fixJsonFile };
