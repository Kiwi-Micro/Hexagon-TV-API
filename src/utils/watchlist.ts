import { ResultSet } from "@libsql/client";
import { parseWatchlist, type Watchlist } from "./types";
import { runSQL } from "./database";

/**
 * Gets the watchlist for a given user.
 * @param userId The userId of the user that we want to get the watchlist for.
 * @returns The watchlist for the user.
 */

async function getWatchlist(userId: string): Promise<Watchlist[]> {
	const dbResults: ResultSet = await runSQL(
		false,
		"SELECT * FROM watchlist WHERE userId = ?",
		true,
		[userId],
	);

	const videoResults: ResultSet = await runSQL(
		false,
		"SELECT * FROM videos WHERE id IN (SELECT videoId FROM watchlist WHERE userId = ?)",
		true,
		[userId],
	);
	const results = parseWatchlist(dbResults, videoResults);
	return results;
}

/**
 * Adds a video to the watchlist.
 * @param video The video to add to the watchlist.
 * @returns True if the video was added to the watchlist, false otherwise.
 */

async function addToWatchlist(video: Watchlist): Promise<boolean> {
	try {
		const dbResults: ResultSet = await runSQL(
			true,
			"INSERT INTO watchlist (userId, videoId) VALUES (?, ?)",
			true,
			[video.userId, video.videoId],
		);
		return dbResults.rowsAffected > 0;
	} catch (error: any) {
		console.error("Error adding to watchlist:", error);
		return false;
	}
}

/**
 * Deletes a video from the given users watchlist.
 * @param video Video to delete from watchlist
 * @returns Returns true if the video was deleted from the watchlist, false otherwise.
 */

async function deleteFromWatchlist(video: Watchlist): Promise<boolean> {
	try {
		const dbResults: ResultSet = await runSQL(
			true,
			"DELETE FROM watchlist WHERE id = ? AND userId = ?",
			true,
			[video.id, video.userId],
		);
		return dbResults.rowsAffected > 0;
	} catch (error: any) {
		console.error("Error removing from watchlist:", error);
		return false;
	}
}

export { getWatchlist, addToWatchlist, deleteFromWatchlist };
