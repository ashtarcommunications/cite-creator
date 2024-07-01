/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
// import eslint from '@eslint/js';
// import { FlatCompat } from '@eslint/eslintrc';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import vitest from 'eslint-plugin-vitest';
// import importPlugin, { configs } from 'eslint-plugin-import';
// import globals from 'globals';
// import eslintConfigPrettier from 'eslint-config-prettier';
import nsda from '@speechanddebate/eslint-config-nsda';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const compat = new FlatCompat({
// 	baseDirectory: __dirname,
// 	resolvePluginsRelativeTo: __dirname,
// });

export default [
	...nsda,
	{
		languageOptions: {
			globals: {
				browser: 'readonly',
				hotkeys: 'readonly',
				splitter: 'readonly',
			},
		},
	},
	{
		rules: {},
	},
];

// export default [
// 	// Top level exclusions
// 	{
// 		ignores: [
// 			'**/dist/**',
// 			'**/vendor/**',
// 			'**/coverage/**',
// 			'**/node_modules/**',
// 		],
// 	},

// 	// Airbnb config doesn't support flat config yet, use legacy configs
// 	...compat.config({
// 		extends: ['airbnb', 'airbnb/hooks'],
// 		overrides: [
// 			{
// 				files: ['**/*.js'],
// 			},
// 		],
// 	}),

// 	// Default configs for eslint
// 	eslint.configs.recommended,
// 	{
// 		languageOptions: {
// 			globals: {
// 				...globals.browser,
// 				...globals.node,
// 				browser: 'readonly',
// 				hotkeys: 'readonly',
// 				splitter: 'readonly',
// 			},
// 		},
// 	},

// 	// Test files config
// 	{
// 		files: ['**/*.test.js', 'setupTests.js'],
// 		plugins: { vitest },
// 		rules: {
// 			...vitest.configs.recommended.rules,
// 		},
// 		languageOptions: {
// 			globals: {
// 				...vitest.environments.env.globals,
// 				...globals.chai,
// 				...globals.jest,
// 			},
// 		},
// 	},

// 	// Import plugin for JS files
// 	{
// 		languageOptions: {
// 			parserOptions: {
// 				ecmaVersion: 'latest',
// 				sourceType: 'module',
// 			},
// 		},
// 		plugins: { import: importPlugin },
// 		settings: {
// 			'import/parsers': {
// 				espree: ['.js'],
// 			},
// 			'import/resolver': {
// 				node: true,
// 			},
// 		},
// 		rules: {
// 			...importPlugin.configs.recommended.rules,
// 		},
// 	},

// 	...nsda,

// 	// Custom rules that override everything else
// 	{
// 		rules: {},
// 	},

// 	// Disable eslint stylistic rules that conflict with Prettier
// 	eslintConfigPrettier,
// ];
