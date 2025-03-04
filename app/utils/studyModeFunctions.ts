import { StudyModeIdentifier, studyModeIdentifiers } from '@/prisma/seedData/studyModes';

export const isDeckDisplayJapanese = (identifier: StudyModeIdentifier): boolean => {
	return [
		studyModeIdentifiers.japaneseRecognition,
		studyModeIdentifiers.produceEnglish,
		studyModeIdentifiers.produceJapaneseAndEnglish,
		studyModeIdentifiers.japaneseAndEnglishRecognition,
	].includes(identifier);
};

export const isDeckDisplayEnglish = (identifier: StudyModeIdentifier): boolean => {
	return [
		studyModeIdentifiers.englishRecognition,
		studyModeIdentifiers.produceJapanese,
		studyModeIdentifiers.produceJapaneseAndEnglish,
		studyModeIdentifiers.japaneseAndEnglishRecognition,
	].includes(identifier);
};

export const isDeckBothJapaneseAndEnglish = (
	identifier: StudyModeIdentifier
): boolean => {
	return [
		studyModeIdentifiers.produceJapaneseAndEnglish,
		studyModeIdentifiers.japaneseAndEnglishRecognition,
	].includes(identifier);
};
