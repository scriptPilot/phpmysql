# PHP MySQL 

Provides MySQL and PHP CRUD API to your local development environment.

## Requirements

Docker and Node.js

## Installation

Create a new app project:

```bash
npm create vite@latest
```

Install this package:

```bash
npm install --save-dev phpmysql
```


-- to be automatized -

Configure the Vite proxy:

```js
server: {
  proxy: {
    // eslint-disable-next-line no-useless-escape
    '^(.+)\.(php)(?:[\?#]|$)': 'http://localhost:8000/'
  }
}
```


## Usage

Module usage ...

## Development

- Commit changes with issue reference
- Run `npm version patch | minor | major` and push changes
- Let the workflow manage the release to GitHub and NPM