'use client';
import { setSnackBarData, SnackbarData } from '@/redux/features/globalSlice';
import { useAppSelector } from '@/redux/store';
import { Snackbar, SnackbarCloseReason } from '@mui/material';
import { FC, ReactNode } from 'react';
import { useDispatch } from 'react-redux';

interface SubLayoutProps {
	children: ReactNode;
}

const SubLayout: FC<SubLayoutProps> = ({ children }) => {
	const snackbarData: SnackbarData = useAppSelector(
		(state) => state.globalReducer.value.snackBarData
	);
	const dispatch = useDispatch();

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
		<>
			{children}
			<Snackbar
				open={snackbarData.isOpen}
				autoHideDuration={2500}
				message={snackbarData.message}
				onClose={handleClose}
			/>
		</>
	);
};

export default SubLayout;
