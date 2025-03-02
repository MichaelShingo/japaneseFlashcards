import { toKana } from 'wanakana';

const handleNConsonants = (romaji: string): string => {
	return romaji.replace(/n(?![aeiounxy]|$)/g, 'ん');
};

export const customToKana = (romaji: string): string => {
	return handleNConsonants(
		toKana(romaji, {
			customKanaMapping: { nn: 'ん', n: 'n' },
			upcaseKatakana: true,
		})
	);
};
