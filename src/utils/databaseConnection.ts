import { createClient } from "@libsql/client";
import config from "../../config.json";

const TURSO_DB_URL = config[0]["TURSO_DB_URL"];
const TURSO_DB_AUTH_TOKEN_R = config[0]["TURSO_DB_AUTH_TOKEN_R"];
const TURSO_DB_AUTH_TOKEN_RW = config[0]["TURSO_DB_AUTH_TOKEN_RW"];

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
