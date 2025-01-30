import { reverseObject } from "@/utils/data";
import { User } from "@prisma/client";

export const userSeedIds: Record<string, number> = {
    [process.env.AUTH0_USER_EMAIL_01 as string]: 1,
    [process.env.AUTH0_USER_EMAIL_02 as string]: 2,
    [process.env.AUTH0_USER_EMAIL_03 as string]: 3,
};

export const reverseUserSeedIds: Record<number, string> = reverseObject(userSeedIds);

export const users: Omit<User, 'createdAt' | 'updatedAt'>[] = [
    {
        id: 1,
        auth0Id: process.env.AUTH0_USER_ID_01,
        email: process.env.AUTH0_USER_EMAIL_01,
        lastName: 'Crawford',
        firstName: 'Michael Shingo',
    },
    {
        id: 2,
        auth0Id: process.env.AUTH0_USER_ID_02,
        email: process.env.AUTH0_USER_EMAIL_02,
        lastName: 'Shingo',
        firstName: 'Michael',
    },
    {
        id: 3,
        auth0Id: process.env.AUTH0_USER_ID_03,
        email: process.env.AUTH0_USER_EMAIL_03,
        lastName: 'Crawford',
        firstName: 'Michael Shingo',
    },
];