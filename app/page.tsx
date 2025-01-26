import Presenter from './presenter';
import { getClient } from "@/app/api";
import { gql } from "@apollo/client";
import { characterQuery } from "@/queries/characterQuery";
import {
	getSession
} from '@auth0/nextjs-auth0';

export default async function Home() {
	const session = await getSession();
	const user = session?.user;
	console.log("🚀 ~ Home ~ user:", user);

	const { data } = await getClient().query({ query: characterQuery });
	console.log("🚀 ~ Home ~ data:", data);


	return (
		<Presenter />
	);
}
