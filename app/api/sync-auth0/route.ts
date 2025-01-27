import { PrismaClient } from '@prisma/client';
import { auth0 } from "@/lib/auth0";

const prisma = new PrismaClient();

export async function GET({ }) {
  const session = await auth0.getSession();
  const user = session?.user;

  if (user) {
    console.log("🚀 ~ GET ~ session:", user);
    const res = await prisma.user.upsert({
      where: { auth0Id: user.sub },
      update: { email: user.email, name: 'New user' },
      create: { auth0Id: user.sub, email: user.email, name: user.name },
    });
    return Response.json({ res });
  }
  return Response.json({ message: 'There is no logged in user.' });

}