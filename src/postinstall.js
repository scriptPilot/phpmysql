import path from 'path'
import fs from 'fs'

const indexPHPFile = path.resolve('../../../public/index.php')

if (!fs.existsSync(indexPHPFile)) {

  fs.writeFileSync(indexPHPFile, '<?php\n\nphpinfo();')

}