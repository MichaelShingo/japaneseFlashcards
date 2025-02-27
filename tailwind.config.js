/** @type {import('tailwindcss').Config} */
const theme = require('./app/utils/tailwindTheme');

module.exports = {
	content: ['./app/**/*.{js,jsx,ts,tsx}'],
	plugins: [require('@xpd/tailwind-3dtransforms')],
	darkMode: 'selector',
	theme: {
		extend: {
			fontFamily: {
				header: ['var(--font-francois)'],
				paragraph: ['var(--font-spartan)'],
				'header-jp': ['var(--font-zen)'],
				'paragraph-jp': ['var(--font-noto)'],
			},
			colors: {
				'ui-01': theme.ui01,
				'ui-02': theme.ui02,
				primary: theme.primary,
				accent: theme.accent,
				secondary: theme.secondary,
				success: theme.success,
				warning: theme.warning,
				error: theme.error,
			},

			keyframes: {
				'flicker-opacity': {
					'0%': { opacity: '70%' },
					'1%': { opacity: '35%' },
					'50%': { opacity: '35%' },
					'51%': { opacity: '70%' },
					'100%': { opacity: '70%' },
				},
			},
			animation: {
				'flicker-opacity': 'flicker-opacity 1.5s infinite',
			},
		},
	},
	plugins: [],
};
