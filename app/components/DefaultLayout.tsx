import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';

interface DefaultLayoutProps {
	maxWidth?: string;
	children: ReactNode;
}

const DefaultLayout: FC<DefaultLayoutProps> = ({ maxWidth = '1000px', children }) => {
	return (
		<Box
			className=" w-[80%] h-fit min-h-[100px] mx-auto"
			sx={{
				maxWidth,
			}}
		>
			{children}
		</Box>
	);
};

export default DefaultLayout;
