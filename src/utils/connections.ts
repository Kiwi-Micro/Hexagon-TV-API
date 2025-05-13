import { Client, createClient } from "@libsql/client";
import config from "../../config.json";
import { createClerkClient } from "@clerk/backend";
import { UTApi } from "uploadthing/server";

// Get the config values.
const TURSO_DB_URL = config[0]["TURSO_DB_URL"] || "";
const TURSO_DB_AUTH_TOKEN_R = config[0]["TURSO_DB_AUTH_TOKEN_R"] || "";
const TURSO_DB_AUTH_TOKEN_RW = config[0]["TURSO_DB_AUTH_TOKEN_RW"] || "";
const UPLOADTHING_TOKEN = config[0]["UPLOADTHING_TOKEN"] || "";
const CLERK_SECRET_KEY = config[0]["CLERK_SECRET_KEY"] || "";

// Create an instance of the UploadThing API.
const utapi = new UTApi({
	token: UPLOADTHING_TOKEN,
});

// Create an instance of the Clerk client.
const clerkClient = createClerkClient({
	secretKey: CLERK_SECRET_KEY,
});

const TURSO_DB_CONNECTION_R = createClient({
	url: TURSO_DB_URL,
	authToken: TURSO_DB_AUTH_TOKEN_R,
});

const TURSO_DB_CONNECTION_RW = createClient({
	url: TURSO_DB_URL,
	authToken: TURSO_DB_AUTH_TOKEN_RW,
});

/**
 * Gets the database connection.
 * @param readWrite whether to use the read-only connection or the read-write connection.
 * @returns The database connection.
 */

function getDbConnection(readWrite: boolean): Client {
	if (readWrite) {
		return TURSO_DB_CONNECTION_RW;
	} else {
		return TURSO_DB_CONNECTION_R;
	}
}

export { getDbConnection, clerkClient, utapi };
