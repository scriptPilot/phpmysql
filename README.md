# PHP MySQL 

Module description ...

## Prerequisites

- Node and Docker installed
- Project setup with `npm create vite@latest`

## Installation

Install the package:

```bash
npm i -D phpmysql
```

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