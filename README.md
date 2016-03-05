# eslint-plugin-microtemplates

[![Build Status](https://travis-ci.org/platinumazure/eslint-plugin-microtemplates.svg?branch=master)](https://travis-ci.org/platinumazure/eslint-plugin-microtemplates)
[![npm](https://img.shields.io/npm/v/eslint-plugin-microtemplates.svg)](https://www.npmjs.com/package/eslint-plugin-microtemplates)
[![npm](https://img.shields.io/npm/dm/eslint-plugin-microtemplates.svg)](https://www.npmjs.com/package/eslint-plugin-microtemplates)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)
[![Join the chat at https://gitter.im/platinumazure/eslint-plugin-microtemplates](https://badges.gitter.im/platinumazure/eslint-plugin-microtemplates.svg)](https://gitter.im/platinumazure/eslint-plugin-microtemplates?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

ESLint plugin for linting Resig-style microtemplate strings.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-microtemplates`:

```
$ npm install eslint-plugin-microtemplates --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-microtemplates` globally.

## Usage

### Basic Configuration

Add `microtemplates` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "microtemplates"
    ]
}
```

You should also ensure ESLint will process HTML files. This can be done on the cli or in the CLIEngine API.

CLI:

```shell
$> eslint --ext .js,.htm,.html <options> <paths>
```

CLIEngine:

```js
var CLIEngine = require("eslint").CLIEngine;

var engine = new CLIEngine({
    extensions: [".js", ".htm", ".html"],
    // etc.
});
```

## Avoiding False Positives

You will want to configure ESLint to avoid common false positives. This might mean creating a separate config file for microtemplate use.

Here are some rules that may be worth disabling for microtemplates:

```json
{
    "rules": {
        "no-undef": 0
    }
}
