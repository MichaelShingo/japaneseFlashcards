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
        name: 'Recognition Front'
    },
    {
        identifier: 'recognitionBack',
        name: 'Recognition Back'
    },
    {
        identifier: 'recognitionBoth',
        name: 'Recognition Both'
    },
    {
        identifier: 'productionFront',
        name: 'Production Front'
    },
    {
        identifier: 'productionBack',
        name: 'Production Back'
    },
    {
        identifier: 'productionBoth',
        name: 'Production Both'
    }
];