import { useUser } from "@auth0/nextjs-auth0";
import { NextPage } from "next";

const AuthProtected: NextPage = () => {
    const { user } = useUser();

    return (
        <div>
            <h2>{user.name}</h2>
        </div>);
};



export default AuthProtected;
