import { Roboto } from 'next/font/google';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { UserProvider } from '@auth0/nextjs-auth0/client';

import { League_Spartan } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '@/redux/provider';
import { Analytics } from '@vercel/analytics/react';
import SubLayout from './subLayout';

const spartan = League_Spartan({
	weight: ['100', '300', '500', '700', '900'],
	subsets: ['latin'],
	variable: '--font-spartan'

});

const roboto = Roboto({
	weight: ['300', '400', '500', '700'],
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-roboto',
});

export default async function RootLayout(
	props: { children: React.ReactNode; }
) {
	return (
		<html className={`${spartan.variable}`}>
			<UserProvider>
				<body className={roboto.variable}>
					<StyledEngineProvider injectFirst>
						<AppRouterCacheProvider options={{ enableCssLayer: true }}>
							<ThemeProvider theme={theme}>
								<ReduxProvider>
									<SubLayout>
										{props.children}
									</SubLayout>
								</ReduxProvider>
								<Analytics />
							</ThemeProvider>
						</AppRouterCacheProvider>
					</StyledEngineProvider>
				</body>
			</UserProvider>
		</html>
	);
}
