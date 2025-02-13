import { Lexend_Deca } from 'next/font/google';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
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


export default async function RootLayout(
  props: { children: React.ReactNode; }
) {
  return (
    <html className={`${lexend.variable} bg-ui-01`}>
      <body className={lexend.variable}>
        <StyledEngineProvider injectFirst>
          <Providers>
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
          </Providers>
        </StyledEngineProvider>
      </body>
    </html>
  );
}
