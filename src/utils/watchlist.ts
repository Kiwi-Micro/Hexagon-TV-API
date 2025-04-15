import { ResultSet } from "@libsql/client";
import { getDbConnection } from "./connections";
import { Watchlist } from "./types";

/**
 * Gets the watchlist for a given user.
 * @param username The username of the user that we want to get the watchlist for.
 * @returns The watchlist for the user.
 */

async function getWatchlist(username: string) {
	// Get the watchlist for the given username.
	const dbResults: ResultSet = await getDbConnection(false).execute({
		sql: "SELECT * FROM watchlist WHERE username = ?",
		args: [username],
	});

	const rows = dbResults.rows || [];
	// Format the watchlist videos.
	const results = rows.map((row) => ({
		id: row.id,
		username: row.username,
		name: row.name,
		urlName: row.urlName,
		thumbnailURL: row.thumbnailURL,
	}));
	// Return the watchlist videos.
	return results;
}

/**
 * Adds a video to the watchlist.
 * @param video The video to add to the watchlist.
 * @returns True if the video was added to the watchlist, false otherwise.
 */

async function addToWatchlist(video: Watchlist) {
	try {
		// Add the video to the watchlist.
		const dbResults: ResultSet = await getDbConnection(true).execute({
			sql: "INSERT INTO watchlist (username, name, urlName, thumbnailURL) VALUES (?, ?, ?, ?)",
			args: [video.username, video.name, video.urlName, video.thumbnailURL],
		});
		// Return true if the video was added to the watchlist.
		return dbResults.rowsAffected > 0;
	} catch (error) {
		// Log the error.
		console.error("Error adding to watchlist:", error);
		return false;
	}
}

/**
 * Deletes a video from the given users watchlist.
 * @param video Video to delete from watchlist
 * @returns Returns true if the video was deleted from the watchlist, false otherwise.
 */

async function deleteFromWatchlist(video: any) {
	try {
		// Delete the video from the watchlist.
		const dbResults: ResultSet = await getDbConnection(true).execute({
			sql: "DELETE FROM watchlist WHERE urlName = ? AND username = ?",
			args: [video.urlName, video.username],
		});
		// Return true if the video was deleted from the watchlist.
		return dbResults.rowsAffected > 0;
	} catch (error) {
		// Log the error.
		console.error("Error removing from watchlist:", error);
		return false;
	}
}

export { getWatchlist, addToWatchlist, deleteFromWatchlist };
