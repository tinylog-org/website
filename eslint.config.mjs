// @ts-check

import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import astro from 'eslint-plugin-astro'
import importX from 'eslint-plugin-import-x'
import typescript from 'typescript-eslint'

export default typescript.config(
    eslint.configs.recommended,
    stylistic.configs['recommended'],
    ...typescript.configs.strict,
    ...astro.configs.recommended,
    {
        plugins: {
            'import-x': importX,
        },
        rules: {
            '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
            '@stylistic/indent': ['error', 4],
            '@stylistic/jsx-indent-props': ['off'],
            '@stylistic/jsx-one-expression-per-line': ['off'],
            'astro/semi': ['error', 'never'],
            'import-x/first': ['error'],
            'import-x/newline-after-import': ['error'],
            'import-x/order': ['error', {
                'alphabetize': { order: 'asc', orderImportKind: 'asc', caseInsensitive: true },
                'groups': [],
                'named': true,
                'newlines-between': 'never',
            }],
            'no-console': ['error'],
        },
    },
)
