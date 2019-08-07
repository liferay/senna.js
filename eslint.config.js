/**
 * © 2019 Liferay, Inc. <https://liferay.com>
 *
 * SPDX-License-Identifier: BSD-3-Clause
 */

 module.exports = {
	env: {
        browser: true
	},
	extends: ['liferay'],
	plugins:['babel'],
	overrides: [
		{
			files: ['**/test/**/*.js'],
			env: {
                mocha: true
			},
			globals: {
				assert: true,
				sinon: true
			},
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