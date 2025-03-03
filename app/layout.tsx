import { Lexend_Deca } from 'next/font/google';
import { StyledEngineProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import './globals.css';
import { ReduxProvider } from '@/redux/provider';
import { Analytics } from '@vercel/analytics/react';
import Providers from './providers';
import SubLayout from './subLayout';

export const lexend = Lexend_Deca({
	weight: ['100', '300', '400', '600', '800', '900'],
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-lexend',
});

export default async function RootLayout(props: { children: React.ReactNode }) {
	return (
		<html className={`${lexend.variable}`}>
			<body className={lexend.variable}>
				<StyledEngineProvider injectFirst>
					<Providers>
						<AppRouterCacheProvider options={{ enableCssLayer: true }}>
							<ReduxProvider>
								<SubLayout>{props.children}</SubLayout>
							</ReduxProvider>
							<Analytics />
						</AppRouterCacheProvider>
					</Providers>
				</StyledEngineProvider>
			</body>
		</html>
	);
}
