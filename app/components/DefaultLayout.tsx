import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';

interface DefaultLayoutProps {
	children: ReactNode;
}

const DefaultLayout: FC<DefaultLayoutProps> = ({ children }) => {
	return (
		<Box className="max-w-[1000px] w-[80%] h-fit min-h-[100px] mx-auto">{children}</Box>
	);
};

export default DefaultLayout;
