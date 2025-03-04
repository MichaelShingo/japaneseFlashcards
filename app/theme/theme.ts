import { PaletteMode } from '@mui/material';
import { amber, grey } from '@mui/material/colors';
import { tailwindTheme } from '../utils/tailwindTheme';

const theme = {
	palette: {
		primary: amber,
	},
};

export const getDesignTokens = (mode: PaletteMode) => ({
	palette: {
		mode,
		...(mode === 'light'
			? {
					// palette values for light mode
					primary: {
						main: tailwindTheme.accent,
					},
					info: {
						main: tailwindTheme.info,
					},
					text: {
						primary: grey[900],
						secondary: grey[800],
					},
				}
			: {
					// palette values for dark mode
					primary: {
						main: tailwindTheme.accent,
					},
					secondary: {
						main: tailwindTheme.secondary,
					},
					info: {
						main: tailwindTheme.info,
					},
					background: {
						default: tailwindTheme.ui01dark,
					},
					text: {
						primary: '#fff',
						secondary: grey[500],
					},
				}),
		success: {
			main: tailwindTheme.success,
		},
		warning: {
			main: tailwindTheme.warning,
		},
		error: {
			main: tailwindTheme.error,
		},
	},
	typography: {
		fontFamily: 'var(--font-lexend)',
		h1: {
			fontWeight: 600,
		},
	},
});

export default theme;
