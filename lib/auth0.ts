import { PrismaClient } from '@prisma/client';
import { getSession } from '@auth0/nextjs-auth0/edge';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export const syncUser = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession();
    console.log("🚀 ~ syncUser ~ session:", session);
    if (session) {

        const { user } = session;
        await prisma.user.upsert({
            where: { auth0Id: user.sub },
            update: { email: user.email, name: 'john crawded' },
            create: { auth0Id: user.sub, email: user.email, name: user.name },
        });
        console.log('updated');
    }
};

// call this every time a user logs in?
// make MembersOnly component that redirects
// look at wistant mentors?
// is there a type for auth0 user? 