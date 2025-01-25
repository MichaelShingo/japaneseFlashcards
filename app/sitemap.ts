import { MetadataRoute } from 'next';
import { urls } from './constants/urls';

type SitemapEntry = {
	url: string;
	lastModified: Date;
	priority: number;
};
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const calcPriority = (url: string) => {
		if (url === urls.home || url === urls.violinist) {
			return 1;
		} else {
			return 0.8;
		}
	};

	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
	const urlList: string[] = Object.values(urls);
	const locales = ['en', 'jp'];
	let fullUrls: SitemapEntry[] = [];

	for (let url of urlList) {
		for (let locale of locales) {
			fullUrls.push({
				url: `${baseUrl}/${locale}${url}`,
				lastModified: new Date(),
				priority: calcPriority(url)
			});
		}
	}

	return [
		...fullUrls
	];
}