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

export { getWatchlist, addToWatchlist, deleteFromWatchlist };
