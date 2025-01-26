import { NextPage } from "next";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";

const AuthProtected: NextPage = withPageAuthRequired(
    async () => {
        const session = await getSession();
        const user = session?.user;
        return <div>
            <h2>{user.name}</h2>
        </div>;
    },
    { returnTo: '/auth-protected' }
);

export default AuthProtected;
