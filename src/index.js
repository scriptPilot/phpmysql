#!/usr/bin/env node

/*
# todo
# - add folder structure
# - add credentials and template file
# - copy it dynamically if not exit
# - add proxy setting
# - add command to package json
# - add credentials file from gitignore
*/

// Import modules
import fs from 'fs-extra'
import path from 'path'
import url from 'url'
import shell from 'shelljs'

// Define folders
const scriptRoot = path.dirname(url.fileURLToPath(import.meta.url))
const appRoot = process.cwd() !== scriptRoot ? process.cwd() : path.resolve(scriptRoot, '../temp')
const publicFolder = path.resolve(appRoot, 'public')

// Define files
const indexPHPFile = path.resolve(appRoot, 'public/index.php')
const composerJsonFile = path.resolve(appRoot, 'composer.json')
const schemaSQLFile = path.resolve(appRoot, 'schema.sql')
const apiScriptFile = path.resolve(appRoot, 'public/api.php')
const credentialsFile = path.resolve(appRoot, 'public/credentials.php')
const composerJsonTemplateFile = path.resolve(scriptRoot, 'composer.json')
const schemaSQLTemplateFile = path.resolve(scriptRoot, 'schema.sql')
const apiScriptTemplateFile = path.resolve(scriptRoot, 'api.php')
const credentialsTemplateFile = path.resolve(scriptRoot, 'credentials.php')

// Ensure folders exist
fs.ensureDirSync(publicFolder)

// Create missing index.php file
if (!fs.existsSync(indexPHPFile)) {
  fs.writeFileSync(indexPHPFile, '<?php\n\nphpinfo();')
  console.log('File "public/index.php" created.')
}

// Create missing api.php file
if (!fs.existsSync(apiScriptFile)) {
  fs.copyFileSync(apiScriptTemplateFile, apiScriptFile)
  console.log('File "public/api.php" created.')
}

// Create missing credentials.php file
if (!fs.existsSync(credentialsFile)) {
  fs.copyFileSync(credentialsTemplateFile, credentialsFile)
  console.log('File "public/credentials.php" created.')
}

// Create missing schema.sql file
if (!fs.existsSync(schemaSQLFile)) {
  fs.copyFileSync(schemaSQLTemplateFile, schemaSQLFile)
  console.log('File "schema.sql" created.')
}

// Create missing composer.json file
if (!fs.existsSync(composerJsonFile)) {
  fs.copyFileSync(composerJsonTemplateFile, composerJsonFile)
  console.log('File "composer.json" created.')
}

// Stop all Docker container
shell.exec(`docker stop $(docker ps -a -q)`)

// Remove all Docker container
shell.exec(`docker rm -f $(docker ps -a -q)`)

// Remove all Docker volumes
shell.exec(`docker volume rm $(docker volume ls -q)`)

// Build the PHP Docker image
if (shell.exec(`docker build -t php "${scriptRoot}"`).code !== 0) {
  throw new Error('Failed to build the PHP Docker image.')
}

// Run the MySQL Docker image
if (shell.exec(`docker run --name mysql -d --restart always \
            -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=development \
            -v "${schemaSQLFile}":/init.sql mariadb:lts --init-file /init.sql`).code !== 0) {
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
if (shell.exec(`docker run -v "${appRoot}":/app composer update`).code !== 0) {
  throw new Error('Failed to install the Composer packages.')
}

// Log completion
console.log('✅ phpMyAdmin is running at http://localhost:8080')
console.log('✅ PHP is running at http://localhost:8000')
console.log('✅ PHP CRUD API is running at http://localhost:8000/api.php/records/tasks')