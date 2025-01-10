import { createClient } from "@libsql/client";

const TURSO_DB_URL = process.env.TURSO_DB_URL || "";
const TURSO_DB_AUTH_TOKEN_R = process.env.TURSO_DB_AUTH_TOKEN_R || "";
const TURSO_DB_AUTH_TOKEN_RW = process.env.TURSO_DB_AUTH_TOKEN_RW || "";

console.log(TURSO_DB_URL);

const TURSO_DB_CONNECTION_R = createClient({
	url: TURSO_DB_URL,
	authToken: TURSO_DB_AUTH_TOKEN_R,
});

const TURSO_DB_CONNECTION_RW = createClient({
	url: TURSO_DB_URL,
	authToken: TURSO_DB_AUTH_TOKEN_RW,
});

function getDbConnection(readOnly: boolean) {
	if (readOnly) {
		return TURSO_DB_CONNECTION_R;
	} else {
		return TURSO_DB_CONNECTION_RW;
	}
}

export { getDbConnection };
