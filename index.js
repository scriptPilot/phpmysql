#!/usr/bin/env node

// Import modules
import path from 'path'
import url from 'url'
import shell from 'shelljs'
import fs from 'fs-extra'

// Define folders
const scriptFolder = path.dirname(url.fileURLToPath(import.meta.url))
const appFolder = process.cwd() !== scriptFolder ? process.cwd() : path.resolve(scriptFolder, 'temp')
const templateFolder = path.resolve(scriptFolder, 'templates')
const publicFolder = path.resolve(appFolder, 'public')

// Define files
const packageFile = path.resolve(appFolder, 'package.json')
const viteConfigFile = path.resolve(appFolder, 'vite.config.js')

// Create folder and files in dev mode
if (process.cwd() === scriptFolder) {
  fs.ensureDirSync(publicFolder)
  if (!fs.existsSync(packageFile)) fs.writeJsonSync(packageFile, {})
  if (!fs.existsSync(viteConfigFile)) fs.writeFileSync(viteConfigFile, 'export default {}')
}

// Check requirements
if (!fs.existsSync(publicFolder)) throw new Error(`❌ Folder not found "${publicFolder}"`)
if (!fs.existsSync(packageFile)) throw new Error(`❌ File not found "${packageFile}"`)
if (!fs.existsSync(viteConfigFile)) throw new Error(`❌ File not found "${viteConfigFile}"`)

// Copy template structure
shell.exec(`cp -rn ${templateFolder}/* ${appFolder}`)

// Add vendor folder and credentials.php to the .gitignore file
// TODO

// Add backend script to the package.json file
const packageFileJson = fs.readJsonSync(packageFile)
const nextPackageFileJson = {
  ...packageFileJson,
  scripts: {
    ...packageFileJson.scripts,
    backend: 'docker compose up -d'
  }
}
fs.writeJsonSync(packageFile, nextPackageFileJson, { spaces: 2 })

// Add proxy settings to the vite.config.js file
// TODO

// Log success
console.log('✅ You can start your backend with "npm run backend"')

process.exit(0)


// Build the PHP Docker image
if (shell.exec(`docker build -t php "${scriptFolder}"`).code !== 0) {
  throw new Error('Failed to build the PHP Docker image.')
}

// Run the MySQL Docker image
if (shell.exec(`docker run --name mysql -d --restart always \
            -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=development \
            -v "${path.resolve(appFolder, 'schema.sql')}":/init.sql mariadb:lts --init-file /init.sql`).code !== 0) {
  throw new Error('Failed to run the Docker MySQL container.')
}

// Run the phpMyAdmin container
if (shell.exec(`docker run --name phpmyadmin -d --link mysql:db -p 8080:80 -e PMA_HOST=mysql phpmyadmin`).code !== 0) {
  throw new Error('Failed to run the Docker phpMyAdmin container.')
}

// Run the PHP Docker container
if (shell.exec(`docker run --name php -d -v "${publicFolder}":/var/www/html -p 8000:80 --link mysql:mysql php`).code !== 0) {
  throw new Error('Failed to run the Docker PHP container.')
}

// Install Composer packages
if (shell.exec(`docker run -v "${appFolder}":/app composer update`).code !== 0) {
  throw new Error('Failed to install the Composer packages.')
}

// Log completion
console.log('✅ phpMyAdmin is running at http://localhost:8080')
console.log('✅ PHP is running at http://localhost:8000')
console.log('✅ PHP CRUD API is running at http://localhost:8000/api.php/records/tasks')