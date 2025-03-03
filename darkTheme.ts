'use client';
import { createTheme } from '@mui/material/styles';
const tailwindTheme = require('./app/utils/tailwindTheme');

const darkTheme = createTheme({
	colorSchemes: {
		dark: true,
	},
	palette: {
		mode: 'dark',
		primary: {
			main: tailwindTheme.accent,
			// dark: tailwindTheme.accentDark,
			// light: tailwindTheme.accentLight,
		},
		secondary: {
			main: tailwindTheme.secondary,
			// dark: tailwindTheme.secondaryDark,
			// light: tailwindTheme.secondaryLight,
		},
		common: {
			white: tailwindTheme.white,
			black: tailwindTheme.ui01,
		},
		info: {
			main: tailwindTheme.info,
		},
		success: {
			main: tailwindTheme.success,
		},
		warning: {
			main: tailwindTheme.warning,
		},
		error: {
			main: tailwindTheme.error,
		},
		text: {
			primary: tailwindTheme.white,
			// secondary: tailwindTheme.gray,
		},
	},
	typography: {
		fontFamily: 'var(--font-lexend)',
		h1: {
			fontWeight: 600,
			color: tailwindTheme.white,
		},
	},
	// components: {
	//     MuiSelect: {
	//         styleOverrides: {
	//             root: {
	//                 color: tailwindTheme.white,
	//                 backgroundColor: tailwindTheme.ui02,
	//             },
	//             outlined: {
	//                 borderColor: tailwindTheme.white,
	//             }
	//         },
	//     },
	//     MuiMenuItem: {
	//         styleOverrides: {
	//             root: {
	//             },

	//         },
	//     },
	// },

	cssVariables: true,
});

export default darkTheme;
