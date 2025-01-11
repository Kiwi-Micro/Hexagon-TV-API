import { ResultSet } from "@libsql/client";
import { getDbConnection } from "./databaseConnection";

async function getWatchlist(username: string) {
	const dbResults: ResultSet = await getDbConnection(true).execute({
		sql: "SELECT * FROM watchlist WHERE username = ?",
		args: [username],
	});

	const rows = dbResults.rows || [];

	const results = rows.map((row) => ({
		id: row[0],
		username: row[1],
		name: row[2],
		urlName: row[3],
		thumbnailURL: row[4],
	}));

	return results;
}

async function addToWatchlist(data: any) {
	try {
		const dbResults: ResultSet = await getDbConnection(false).execute({
			sql: "INSERT INTO watchlist (username, name, urlName, thumbnailURL) VALUES (?, ?, ?, ?)",
			args: [data.username, data.name, data.urlName, data.thumbnailURL],
		});
		return dbResults.rowsAffected > 0;
	} catch (error) {
		console.error("Error adding to watchlist:", error);
		return false;
	}
}

async function deleteFromWatchlist(data: any) {
	try {
		const dbResults: ResultSet = await getDbConnection(false).execute({
			sql: "DELETE FROM watchlist WHERE urlName = ? AND username = ?",
			args: [data.urlName, data.username],
		});
		return dbResults.rowsAffected > 0;
	} catch (error) {
		console.error("Error removing from watchlist:", error);
		return false;
	}
}

/*
To Implemant:
def auth(sessionId, username):
	connection = getDbConnection()
	cursor = connection.cursor()

	try:
		query = """
		SELECT sessionId FROM sessions
		WHERE sessionId = %s AND username = %s
		"""
		cursor.execute(query, (sessionId, username))
		results = cursor.fetchall()
		cleanUp(cursor, connection)
		if results:
			return True
		else:
			return False
	except Exception as e:
		cleanUp(cursor, connection)
		raise RuntimeError(f"Error checking auth: {e}")
		return False
*/

async function auth(sessionId: string, username: string) {
	try {
		const dbResults: ResultSet = await getDbConnection(false).execute({
			sql: "SELECT sessionId FROM sessions WHERE sessionId = ? AND username = ?",
			args: [sessionId, username],
		});
		return dbResults.rows.length > 0;
	} catch (error) {
		console.error("Error checking auth:", error);
		return false;
	}
}

export { getWatchlist, addToWatchlist, deleteFromWatchlist, auth };
