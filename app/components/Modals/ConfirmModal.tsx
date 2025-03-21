import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	TextField,
} from '@mui/material';
import { FC, ReactNode, useEffect, useState } from 'react';

export interface ConfirmModalProps {
	title: string;
	open: boolean;
	text?: string;
	onClose: () => void;
	confirmAction: () => void;
	confirmWithInput?: boolean;
	confirmWithInputValue?: string;
	children?: ReactNode;
	isLoading?: boolean;
}

const ConfirmModal: FC<ConfirmModalProps> = ({
	title,
	open,
	text,
	onClose,
	confirmAction,
	confirmWithInput,
	confirmWithInputValue = 'confirm',
	children,
	isLoading,
}) => {
	const [confirmValue, setConfirmValue] = useState('');

	const handleConfirm = () => {
		confirmAction();
		setConfirmValue('');
	};

	useEffect(() => {
		if (!isLoading) {
			onClose();
		}
	}, [isLoading]);

	return (
		<Dialog open={open} onClick={(e) => e.stopPropagation()}>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>
				{text ? text : children}
				{confirmWithInput && (
					<FormControl>
						<TextField
							value={confirmValue}
							onChange={(e) => setConfirmValue(e.target.value)}
							label={`Type "${confirmWithInputValue}" to confirm`}
							variant="outlined"
						/>
					</FormControl>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button
					loading={isLoading}
					disabled={confirmWithInput && !(confirmValue === confirmWithInputValue)}
					onClick={handleConfirm}
					type="submit"
				>
					Confirm
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmModal;
