import { reverseObject } from "@/utils/data";
import { StudyMode } from "@prisma/client";

export const studyModeSeedIds: Record<string, number> = {
  recognitionFront: 1,
  recognitionBack: 2,
  recognitionBoth: 3,
  productionFront: 4,
  productionBack: 5,
  productionBoth: 6,
};

export const reverseStudyModeSeedIds: Record<number, string> = reverseObject(studyModeSeedIds);


export const studyModes: Omit<StudyMode, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    identifier: 'recognitionFront',
    name: 'Japanese Recognition',
    description: 'Given the Japanese word, self-rate your English translation.'
  },
  {
    identifier: 'recognitionBack',
    name: 'English Recognition',
    description: 'Given the English word, self-rate your Japanese translation.'
  },
  {
    identifier: 'recognitionBoth',
    name: 'Japanese and English Recognition',
    description: 'Given the Japanese word, self-rate your English translation. Then sometime later, given the English word, self-rate your Japanese translation.'
  },
  {
    identifier: 'productionFront',
    name: 'Produce Japanese from English',
    description: 'Given the English word, type the Japanese translation.'
  },
  {
    identifier: 'productionBack',
    name: 'Produce English from Japanese',
    description: 'Given the Japanese word, type the English translation.'
  },
  {
    identifier: 'productionBoth',
    name: 'Produce Japanese and English',
    description: 'Given the English word, type the Japanese translation. Then sometime later, given the Japanese word, type the English translation.'
  }
];