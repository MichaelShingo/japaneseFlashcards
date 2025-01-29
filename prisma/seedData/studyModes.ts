import { reverseObject } from "@/utils/data";
import { StudyMode } from "@prisma/client";

export const studyModeSeedIds: Record<string, number> = {
    recognitionFront: 0,
    recognitionBack: 1,
    recognitionBoth: 2,
    productionFront: 3,
    productionBack: 4,
    productionBoth: 5,
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