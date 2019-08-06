/**
 * © 2019 Liferay, Inc. <https://liferay.com>
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

 module.exports = {
	env: {
        browser: true
	},
	extends: [require.resolve('eslint-config-liferay'), require.resolve('eslint-config-prettier')],
	plugins:['babel'],
	globals: {
        after: true,
        assert: true,
        before: true,
        sinon: true
	},
	overrides: [
		{
			files: ['**/test/**/*.js'],
			env: {
                mocha: true
			}
		}
	],
	parser: 'babel-eslint',
	parserOptions: {
		ecmaVersion: 2018
	},
    root: true,
    rules: {
        "no-console": 0
    }
};