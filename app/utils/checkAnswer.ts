const levenshteinDistance = (a: string, b: string): number => {
	const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
		Array(b.length + 1).fill(0)
	);

	for (let i = 0; i <= a.length; i++) {
		for (let j = 0; j <= b.length; j++) {
			if (i === 0) {
				matrix[i][j] = j;
			} else if (j === 0) {
				matrix[i][j] = i;
			} else if (a[i - 1] === b[j - 1]) {
				matrix[i][j] = matrix[i - 1][j - 1];
			} else {
				matrix[i][j] =
					1 + Math.min(matrix[i - 1][j], matrix[i][j - 1], matrix[i - 1][j - 1]);
			}
		}
	}

	return matrix[a.length][b.length];
};

export const isCloseEnough = (a: string, b: string, threshold: number): boolean => {
	return levenshteinDistance(a, b) <= threshold;
};

export const containsJapaneseChar = (answer: string): boolean => {
	const allJapaneseChars: RegExp = /[\u3040-\u30FF\u4E00-\u9FFF\uFF66-\uFF9F]/;
	return allJapaneseChars.test(answer);
};

export const containsEnglishChar = (answer: string): boolean => {
	const allEnglishChars: RegExp = /[a-zA-Z]/;
	return allEnglishChars.test(answer);
};

export const containsSymbols = (answer: string): boolean => {
	const pattern = /[!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?`~]/;
	return pattern.test(answer);
};
