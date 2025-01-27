
import Presenter from './presenter';
// import { getClient } from "@/app/api";
import { characterQuery } from "@/queries/characterQuery";
import { useUser } from '@auth0/nextjs-auth0';

export default async function Home() {

	// const { data } = await getClient().query({ query: characterQuery });


	return (
		<Presenter />
	);
}
