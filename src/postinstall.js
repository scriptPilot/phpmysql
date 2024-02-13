#!/usr/bin/env node

import path from 'path'
import fs from 'fs'

let isInstalled = false
try {
  isInstalled = fs.existsSync(path.resolve('../../../package.json'))
} catch {}

console.log(isInstalled ? 'yes' : 'no')

if (isInstalled) {
  const indexPHPFile = path.resolve('../../../public/index.php')
  if (!fs.existsSync(indexPHPFile)) {
    fs.writeFileSync(indexPHPFile, '<?php\n\nphpinfo();')
  }
}