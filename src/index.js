#!/usr/bin/env node

// Import modules
import path from 'path'
import fs from 'fs'

// Get installation status
let isInstalled = false
try {
  isInstalled = fs.existsSync(path.resolve('../../../package.json'))
} catch {}
console.log(isInstalled ? 'Running as an installed package.' : 'Running in development mode.')

// Create missing index.php file
if (isInstalled) {
  const indexPHPFile = path.resolve('../../../public/index.php')
  if (!fs.existsSync(indexPHPFile)) {
    fs.writeFileSync(indexPHPFile, '<?php\n\nphpinfo();')
    console.log('File "public/index.php" created.')
  }
}