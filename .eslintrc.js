module.exports = {
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: "module",
		ecmaFeatures: {
			jsx: true,
		},
	},
	plugins: ["@typescript-eslint", "simple-import-sort", "import"],
	extends: ["eslint:recommended", "@typescript-eslint/recommended", "prettier"],
	rules: {
		// Prettier rules (these will be formatted by Prettier, but ESLint can warn)
		"prettier/prettier": "error",

		// Import sorting and organization
		"simple-import-sort/imports": [
			"error",
			{
				groups: [
					// Node.js builtins
					["^node:"],
					// External packages (react, lodash, etc.)
					["^@?\\w"],
					// Internal aliases (if you use path aliases)
					["^@/"],
					// Parent imports
					["^\\.\\.(?!/?$)", "^\\.\\./?$"],
					// Other relative imports
					["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
					// Style imports
					["^.+\\.s?css$"],
				],
			},
		],
		"simple-import-sort/exports": "error",
		"import/first": "error",
		"import/newline-after-import": "error",
		"import/no-duplicates": "error",

		// Disallow relative imports starting with dot
		"no-restricted-imports": [
			"error",
			{
				patterns: [
					{
						group: ["./*"],
						message: "Relative imports starting with dot are not allowed.",
					},
				],
			},
		],

		// TypeScript specific rules
		"@typescript-eslint/no-unused-vars": "error",
		"@typescript-eslint/no-explicit-any": "warn",
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
	},
	settings: {
		"import/parsers": {
			"@typescript-eslint/parser": [".ts", ".tsx"],
		},
		"import/resolver": {
			typescript: {
				alwaysTryTypes: true,
			},
		},
	},
};
