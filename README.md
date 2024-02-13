# PHP MySQL 

Module description ...

## Installation

Install the package:

```bash
npm i -D phpmysql
```

Configure the Vite proxy:

```js
server: {
  proxy: {
    '^(.+)\.(php)(?:[\?#]|$)': 'http://localhost:8000/' // eslint-disable-line no-useless-escape
  }
}
```


## Usage

Module usage ...

## Development

- Commit changes with issue reference
- Run `npm version patch | minor | major` and push changes
- Let the workflow manage the release to GitHub and NPM