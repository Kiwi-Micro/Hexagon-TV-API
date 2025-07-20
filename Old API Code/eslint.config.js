import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
	{
		files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
		languageOptions: {
			globals: globals.browser,
		},
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{
		ignores: [
			"**/node_modules/**",
			"**/dist/**",
			"**/.vscode/**",
			"**/.git/**",
			"**/.github/**",
		],
	},
	{
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
		},
	},
];
