import globals from 'globals'
import js from "@eslint/js"

// interesting REF: https://github.com/microsoft/vscode-eslint/blob/main/playgrounds/flat-config/eslint.config.js

export default [
  js.configs.recommended,
  {
    "files": [
      "**/*.js"
    ],
    "languageOptions": {
      "sourceType": "module",
      "globals": {
        ...globals.browser,
        ...globals.node,
        ...globals.es6,
        ...globals.commonjs,
        ...globals.mocha
      }
    },
    "rules": {
      "semi": [
        "warn",
        "never",
        {
          "beforeStatementContinuationChars": "always"
        }
      ],
      "no-tabs": "error",
      "indent": [
        "error",
        2
      ],
      "linebreak-style": [
        "error",
        "unix"
      ],
      "max-statements-per-line": [
        "error",
        {
          "max": 1
        }
      ],
      "space-before-function-paren": [
        "error",
        {
          "anonymous": "always",
          "named": "never",
          "asyncArrow": "always"
        }
      ],
      "comma-dangle": "off",
      "no-multiple-empty-lines": [
        "warn",
        {
          "max": 3,
          "maxBOF": 1,
          "maxEOF": 1
        }
      ],
      "import/no-named-as-default-member": "off"
    }
  }
]
