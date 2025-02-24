import { reverseObject } from "@/utils/data";
import { StudyMode } from "@prisma/client";

export type StudyModeType = 'production' | 'recognition';
export const studyModeTypeMap = {
  production: 'production',
  recognition: 'recognition',
};

export const studyModeSeedIds: Record<string, number> = {
  recognitionFront: 1,
  recognitionBack: 2,
  recognitionBoth: 3,
  productionFront: 4,
  productionBack: 5,
  productionBoth: 6,
};

export const reverseStudyModeSeedIds: Record<number, string> = reverseObject(studyModeSeedIds);


export const studyModeIdentifiers: Record<string, string> = {
  japaneseRecognition: 'japaneseRecognition',
  englishRecognition: 'englishRecognition',
  japaneseAndEnglishRecognition: 'japaneseAndEnglishRecognition',
  produceJapanese: 'produceJapanese',
  produceEnglish: 'produceEnglish',
  produceJapaneseAndEnglish: 'produceJapaneseAndEnglish',
};

export const studyModes: Omit<StudyMode, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    identifier: studyModeIdentifiers.japaneseRecognition,
    name: 'Japanese Recognition',
    description: 'Given the Japanese word, self-rate your English translation.',
    type: 'recognition'
  },
  {
    identifier: studyModeIdentifiers.englishRecognition,
    name: 'English Recognition',
    description: 'Given the English word, self-rate your Japanese translation.',
    type: 'recognition'
  },
  {
    identifier: studyModeIdentifiers.japaneseAndEnglishRecognition,
    name: 'Japanese and English Recognition',
    description: 'Given the Japanese word, self-rate your English translation. Then sometime later, given the English word, self-rate your Japanese translation.',
    type: 'recognition'
  },
  {
    identifier: studyModeIdentifiers.produceJapanese,
    name: 'Produce Japanese from English',
    description: 'Given the English word, type the Japanese translation.',
    type: 'production'
  },
  {
    identifier: studyModeIdentifiers.produceEnglish,
    name: 'Produce English from Japanese',
    description: 'Given the Japanese word, type the English translation.',
    type: 'production'
  },
  {
    identifier: studyModeIdentifiers.produceJapaneseAndEnglish,
    name: 'Produce Japanese and English',
    description: 'Given the English word, type the Japanese translation. Then sometime later, given the Japanese word, type the English translation.',
    type: 'production'
  }
];