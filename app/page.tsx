import Presenter from './presenter';
import { getClient } from "@/app/api";
import { gql } from "@apollo/client";
import { characterQuery } from "@/queries/characterQuery";

export default async function Home() {
	const { data } = await getClient().query({ query: characterQuery });
	console.log("🚀 ~ Home ~ data:", data);


	return (
		<Presenter />
	);
}
