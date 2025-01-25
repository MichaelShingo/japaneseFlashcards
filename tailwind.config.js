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
				primary: theme.primary,
				accent: theme.accent,
				secondary: theme.secondary,
				error: theme.error,
				'secondary-light': '#a2af9f',
				blueprimary: '#FFFFFF',
				blueaccent: '#504AFF',
				bluesecondary: '#23206F',

				'black-trans': 'rgba(0,0,0,0.35)',
				'black-trans-1': 'rgba(0,0,0,0.75)',
				'green-sat': '#007c00',
				'green-light': '#4cb94c',
				'green-extra-light': '#a7fab5',
				green: {
					100: '#E6FFE3',
					200: '#BDEAB9',
					300: '#94D88F',
					400: '#6FB269',
					500: '#518E4C',
					600: '#386D32',
					700: '#1F4419',
					800: '#11280D',
					900: '#061104',
					1000: '#040C03',
				}

			},
			keyframes: {
				'inch-worm': {
					'0%': { scaleY: '100%' },
					'10%': { scaleY: '125%' },
					'20%': { scaleY: '100%' },
					'30%': { scaleY: '125%' },
					'40%': { scaleY: '100%' },
					'50%': { scaleY: '125%' },
					'60%': { scaleY: '100%' },
					'70%': { scaleY: '125%' },
					'80%': { scaleY: '100%' },
					'90%': { scaleY: '125%' },
					'100%': { scaleY: '100%' },
				}
			},
		},
	},
	plugins: [],
};
