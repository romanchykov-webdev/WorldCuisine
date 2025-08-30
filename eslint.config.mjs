import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactNative from 'eslint-plugin-react-native'
import reactHooks from 'eslint-plugin-react-hooks'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        __DEV__: true,
      },
    },
    plugins: {
      react,
      'react-native': reactNative,
      'react-hooks': reactHooks,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-native/no-unused-styles': 'warn',
      'react-native/no-inline-styles': 'off',
    },
    settings: {
      react: { version: 'detect' },
    },
  },
]
