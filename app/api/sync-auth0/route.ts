import { PrismaClient } from '@prisma/client';
import { getSession } from '@auth0/nextjs-auth0/edge';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getSession();
  if (session) {
    console.log("🚀 ~ GET ~ session:", session);
    const { user } = session;
    const res = await prisma.user.upsert({
      where: { auth0Id: user.sub },
      update: { email: user.email, name: 'dog' },
      create: { auth0Id: user.sub, email: user.email, name: user.name },
    });
    return Response.json({ res });
  }
  return Response.json({ message: 'There is no logged in user.' });

}