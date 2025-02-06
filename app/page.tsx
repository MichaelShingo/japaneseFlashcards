
import { signIn, signOut, auth } from "@/auth";

export default async function Home() {
	const session = await auth();


	return (
		<>
			{!session ? (

				<form
					action={async () => {
						"use server";
						await signIn('google', { redirectTo: '/dashboard' });
					}}
				>
					<button type="submit">Signin with Google</button>
				</form>
			) :
				(


					<form
						action={async () => {
							"use server";
							await signOut();
						}}
					>	<p>{session.user.email}</p>
						<img src={session.user.image} alt="User Avatar" />
						<button type="submit">Sign Out</button>
					</form>
				)}
		</>
	);
}
