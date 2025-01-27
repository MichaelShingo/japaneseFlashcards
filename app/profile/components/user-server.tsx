import { useUser } from "@auth0/nextjs-auth0";

export const ProfileServer = async () => {
    const { user } = useUser();

    if (!user) {
        return null;
    }

    return user ? (
        <div>
            <img src={user.picture} alt={user.name} />
            <h2>{user.name}</h2>
            <p>{user.email}</p>
        </div>
    ) : (
        <div>No user logged in</div>
    );
};

export default ProfileServer;