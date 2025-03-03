/** @type {import('tailwindcss').Config} */
import { tailwindTheme } from './app/utils/tailwindTheme';

module.exports = {
	content: ['./app/**/*.{js,jsx,ts,tsx}', './features/**/*.{js,jsx,ts,tsx}'],
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
				'ui-01': {
					DEFAULT: tailwindTheme.ui01,
					light: tailwindTheme.ui01,
					dark: tailwindTheme.ui01dark,
				},
				'ui-02': {
					DEFAULT: tailwindTheme.ui02,
					light: tailwindTheme.ui02,
					dark: tailwindTheme.ui02dark,
				},
				primary: tailwindTheme.primary,
				accent: tailwindTheme.accent,
				secondary: tailwindTheme.secondary,
				success: tailwindTheme.success,
				warning: tailwindTheme.warning,
				error: tailwindTheme.error,
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
