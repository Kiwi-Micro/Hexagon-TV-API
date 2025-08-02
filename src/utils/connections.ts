import { Client, createClient } from "@libsql/client";
import { createClerkClient } from "@clerk/backend";
import { UTApi } from "uploadthing/server";

// Get the config values.
const TURSO_DB_URL = process.env.TURSO_DB_URL || "";
const TURSO_DB_AUTH_TOKEN_R = process.env.TURSO_DB_AUTH_TOKEN_R || "";
const TURSO_DB_AUTH_TOKEN_RW = process.env.TURSO_DB_AUTH_TOKEN_RW || "";
const UPLOADTHING_TOKEN = process.env.UPLOADTHING_TOKEN || "";
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY || "";

// Create an instance of the UploadThing API.
export const utapi = new UTApi({
	token: UPLOADTHING_TOKEN,
});

// Create an instance of the Clerk client.
export const clerkClient = createClerkClient({
	secretKey: CLERK_SECRET_KEY,
});

// Access Via `getDbConnection(false)`.
const TURSO_DB_CONNECTION_R = createClient({
	url: TURSO_DB_URL,
	authToken: TURSO_DB_AUTH_TOKEN_R,
});

// Access Via `getDbConnection(true)`.
const TURSO_DB_CONNECTION_RW = createClient({
	url: TURSO_DB_URL,
	authToken: TURSO_DB_AUTH_TOKEN_RW,
});

/**
 * Gets the database connection.
 * @param readWrite whether to use the read-only connection or the read-write connection.
 * @returns The database connection.
 */

export function getDbConnection(readWrite: boolean): Client {
	if (readWrite) {
		return TURSO_DB_CONNECTION_RW;
	} else {
		return TURSO_DB_CONNECTION_R;
	}
}
