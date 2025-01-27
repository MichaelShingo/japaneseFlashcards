import { useUser } from "@auth0/nextjs-auth0";
import ProfileClient from "./components/user-client";
import ProfileServer from "./components/user-server";
import { redirect } from "next/navigation";

const Profile = async () => {
    const { user } = useUser();
    if (!user) {
        redirect('/');
    }
    return <div>

        <ProfileClient />
        <ProfileServer />
    </div>;
};

export default Profile;