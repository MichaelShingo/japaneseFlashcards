'use client';
import {
	setColorMode,
	setSnackBarData,
	SnackbarData,
} from '@/redux/features/globalSlice';
import { useAppSelector } from '@/redux/store';
import { ThemeProvider } from '@emotion/react';
import { createTheme, CssBaseline, Snackbar, SnackbarCloseReason } from '@mui/material';
import { FC, ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import darkTheme from '@/darkTheme';
import { useThemeContext } from './theme/ThemeContextProvider';
import { twMerge } from 'tailwind-merge';
import { getDesignTokens } from './theme/theme';

interface SubLayoutProps {
	children: ReactNode;
}

const SubLayout: FC<SubLayoutProps> = ({ children }) => {
	const snackbarData: SnackbarData = useAppSelector(
		(state) => state.globalReducer.value.snackBarData
	);
	const dispatch = useDispatch();
	const colorMode = useAppSelector((state) => state.globalReducer.value.colorMode);

	// const theme = createTheme({
	// 	palette: {
	// 		mode: colorMode,
	// 	},
	// });

	const handleClose = (
		event: React.SyntheticEvent | Event,
		reason?: SnackbarCloseReason
	) => {
		if (reason === 'clickaway') {
			return;
		}
		dispatch(setSnackBarData({ isOpen: false, message: '' }));
	};

	return (
		<ThemeProvider theme={createTheme(getDesignTokens(colorMode))}>
			<CssBaseline />
			<div
				className={twMerge([colorMode, 'bg-ui-01 dark:bg-ui-01-dark h-screen w-screen'])}
			>
				{children}
				<Snackbar
					open={snackbarData.isOpen}
					autoHideDuration={2500}
					message={snackbarData.message}
					onClose={handleClose}
				/>
			</div>
		</ThemeProvider>
	);
};

export default SubLayout;
