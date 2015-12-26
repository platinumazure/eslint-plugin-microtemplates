# eslint-plugin-microtemplates

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

Add `microtemplates` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "microtemplates"
    ]
}
```





