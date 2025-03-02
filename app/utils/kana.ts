import { toKana, toKatakana } from 'wanakana';

const handleNConsonants = (romaji: string): string => {
	return romaji.replace(/n(?![aeiounxy]|$)/g, 'ん');
};

export const customToKana = (romaji: string, katakanaInput: boolean): string => {
	if (katakanaInput) {
		return handleNConsonants(
			toKatakana(romaji, {
				customKanaMapping: { nn: 'ん', n: 'n' },
			})
		);
	}
	return handleNConsonants(
		toKana(romaji, {
			customKanaMapping: { nn: 'ん', n: 'n' },
		})
	);
};
