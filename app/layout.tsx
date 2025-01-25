import type { Metadata } from 'next';
import { Nanum_Myeongjo, League_Spartan, Readex_Pro, Zen_Antique_Soft, Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '@/redux/provider';
import { Analytics } from '@vercel/analytics/react';
import SubLayout from './subLayout';
import { getMessages } from 'next-intl/server';

const zenAntique = Zen_Antique_Soft({
	weight: "400",
	style: "normal",
	subsets: ["latin"],
});

const notoSansJapanese = Noto_Sans_JP({
	weight: ['400', '600', '900'],
	subsets: ['latin'],
	variable: '--font-noto'
});

const francois = Readex_Pro({
	weight: ['700'],
	subsets: ['latin'],
	variable: '--font-francois'

});

const spartan = League_Spartan({
	weight: ['100', '300', '500', '700', '900'],
	subsets: ['latin'],
	variable: '--font-spartan'

});

// export const metadata: Metadata = {
// 	title: {
// 		default: 'Tokyo Violinist | Michael Shingo Crawford',
// 		template: '%s - Michael Shingo Crawford',
// 	},
// 	description:
// 		'Michael Shingo Crawford, a violinist, composer, and arranger in Tokyo, Japan. Specializing in classical and anime music.',
// 	twitter: {
// 		card: 'summary_large_image'
// 	},
// 	metadataBase: new URL('https://michaelshingo.com/'),
// };

export default async function RootLayout(
	props: { children: React.ReactNode; }
) {
	const {
		children
	} = props;


	return (
		<html className={`${spartan.variable} ${francois.variable} ${notoSansJapanese.variable}`}>
			<body>
				<ReduxProvider>
					<SubLayout>
						{children}
					</SubLayout>
				</ReduxProvider>
				<Analytics />
			</body>
		</html>
	);
}
