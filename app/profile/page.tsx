import { getSession } from "@auth0/nextjs-auth0";
import ProfileClient from "./components/user-client";
import ProfileServer from "./components/user-server";
import { redirect } from "next/navigation";

const Profile = async () => {
    const session = await getSession();
    const user = session?.user;
    if (!user) {
        redirect('/');
    }
    return <div>

        <ProfileClient />
        <ProfileServer />
    </div>;
};

export default Profile;