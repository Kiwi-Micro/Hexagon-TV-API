import { ResultSet } from "@libsql/client";
import { getDbConnection } from "./connections";
import type { Watchlist } from "./types";

/**
 * Gets the watchlist for a given user.
 * @param userId The userId of the user that we want to get the watchlist for.
 * @returns The watchlist for the user.
 */

async function getWatchlist(userId: string) {
	// Get the watchlist for the given username.
	const dbResults: ResultSet = await getDbConnection(false).execute({
		sql: "SELECT * FROM watchlist WHERE userId = ?",
		args: [userId],
	});

	const rows = dbResults.rows || [];
	// Get the videos for the watchlist.
	const videoResults: ResultSet = await getDbConnection(false).execute({
		sql: "SELECT * FROM videos WHERE id IN (SELECT videoId FROM watchlist WHERE userId = ?)",
		args: [userId],
	});
	const videoRows = videoResults.rows || [];
	// Format the watchlist videos and add the videos to the watchlist.
	const results = rows.map((row) => {
		const video = videoRows.find((videoRow) => videoRow.id === row.videoId);
		return {
			id: row.id,
			userId: row.userId,
			videoId: row.videoId,
			video: video,
		};
	});
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
			sql: "INSERT INTO watchlist (userId, videoId) VALUES (?, ?)",
			args: [video.userId, video.videoId],
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

async function deleteFromWatchlist(video: Watchlist) {
	try {
		// Delete the video from the watchlist.
		const dbResults: ResultSet = await getDbConnection(true).execute({
			sql: "DELETE FROM watchlist WHERE id = ? AND userId = ?",
			args: [video.id, video.userId],
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
