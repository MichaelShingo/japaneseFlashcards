import { toKana, toKatakana } from 'wanakana';

const handleNConsonants = (romaji: string): string => {
	return romaji.replace(/n(?![aeiounxy]|$)/g, 'ん');
};

const convertRomajiSegment = (segment: string, katakanaInput: boolean): string => {
	if (katakanaInput) {
		return handleNConsonants(
			toKatakana(segment, {
				customKanaMapping: { nn: 'ん', n: 'n' },
			})
		);
	}
	return handleNConsonants(
		toKana(segment, {
			customKanaMapping: { nn: 'ん', n: 'n' },
		})
	);
};

export const customToKana = (input: string, katakanaInput: boolean): string => {
	const romajiRegex = /[a-zA-Z]+/g;
	const segments = input.split(romajiRegex);
	const romajiSegments = input.match(romajiRegex) || [];

	const convertedSegments = segments.map((segment, index) => {
		if (index < romajiSegments.length) {
			return segment + convertRomajiSegment(romajiSegments[index], katakanaInput);
		}
		return segment;
	});

	return convertedSegments.join('');
};
