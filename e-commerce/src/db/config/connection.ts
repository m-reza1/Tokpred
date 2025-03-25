import { MongoClient } from "mongodb";

const connectionString = process.env.MONGODB_URI;
// console.log("connectionString: ", connectionString);

if (!connectionString) {
	throw new Error("MONGODB_CONNECTION_STRING is not defined");
}

let client: MongoClient;

export const getMongoClientInstance = async () => {
	if (!client) {
		client = await MongoClient.connect(connectionString);
		await client.connect();
	}

	return client;
};