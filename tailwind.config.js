/** @type {import('tailwindcss').Config} */
const theme = require('./app/utils/tailwindTheme');

module.exports = {
	content: ['./app/**/*.{js,jsx,ts,tsx}'],
	plugins: [
		require("@xpd/tailwind-3dtransforms")
	],
	darkMode: 'selector',
	theme: {
		extend: {
			fontFamily: {
				'header': ['var(--font-francois)'],
				'paragraph': ['var(--font-spartan)'],
				'header-jp': ['var(--font-zen)'],
				'paragraph-jp': ['var(--font-noto)']
			},
			colors: {
				'ui-01': theme.ui01,
				'ui-02': theme.ui02,
				primary: theme.primary,
				accent: theme.accent,
				secondary: theme.secondary,
				error: theme.error,
			},
			keyframes: {
				'inch-worm': {
					'0%': { scaleY: '100%' },
					'100%': { scaleY: '100%' },
				}
			},
		},
	},
	plugins: [],
};
