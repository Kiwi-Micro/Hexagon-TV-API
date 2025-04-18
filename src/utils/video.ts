import { ResultSet } from "@libsql/client";
import { getDbConnection, utapi } from "./connections";
import type { Video } from "./types";
import { getAgeRatingInfo } from "./ageRating";

/**
 * Formats the videos from the database.
 * @param dbResults The videos from the database results.
 * @returns The formatted videos.
 */

async function parseVideos(dbResults: any) {
	const rows = dbResults.rows || [];
	const results = rows.map(async (row: any) => ({
		id: row.id,
		name: row.name,
		description: row.description,
		thumbnailURL: row.thumbnailURL,
		videoURL: row.videoURL,
		dateReleased: row.dateReleased,
		urlName: row.urlName,
		ageRating: row.ageRating,
		ageRatingInfo: (await getAgeRatingInfo(row.ageRating)) || "Age Rating not found",
		category: row.category,
		videoUrlKey: row.videoURLKey,
		thumbnailUrlKey: row.thumbnailURLKey,
		isPartOfTVShow: row.isPartOfTVShow,
		tvShowId: row.tvShowId,
	}));
	return await Promise.all(results);
}

/**
 * Gets all videos from the database that match the query.
 * @param query The query to search for.
 * @returns An array of videos.
 */

async function getVideosForSearch(query: string) {
	const dbResults: ResultSet = await getDbConnection(false).execute({
		sql: "SELECT * FROM videos WHERE name LIKE ?",
		args: [`%${query}%`],
	});
	return parseVideos(dbResults);
}

/**
 * Gets all videos from the database.
 * @returns An array of videos.
 */

async function getVideos() {
	const dbResults: ResultSet = await getDbConnection(false).execute(
		"SELECT * FROM videos",
	);
	return parseVideos(dbResults);
}

/**
 * This function adds a video to the database.
 * @param data The data to add the video.
 * @returns True if the video was added, false otherwise.
 */

async function addVideo(data: Video) {
	const dbResults: ResultSet = await getDbConnection(true).execute({
		sql: "INSERT INTO videos (name, description, thumbnailURL, videoURL, dateReleased, urlName, ageRating, category, videoURLKey, thumbnailURLKey, isPartOfTVShow, tvShowId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		args: [
			data.name,
			data.description,
			data.thumbnailURL,
			data.videoURL,
			data.date,
			data.urlName,
			data.ageRating,
			data.category,
			data.videoURL.split("/f/").pop() || "",
			data.thumbnailURL.split("/f/").pop() || "",
			// TODO: Add TV show ID
			data.isPartOfTVShow || "false",
			data.tvShowId || "0",
		],
	});
	return dbResults.rowsAffected > 0;
}

/**
 * This function updates a video in the database.
 * @param data The data to update the video.
 * @returns True if the video was updated, false otherwise.
 */

async function updateVideo(data: Video) {
	const videoUrlKey = data.videoURL.split("/f/").pop() || "";
	const thumbnailUrlKey = data.thumbnailURL.split("/f/").pop() || "";
	const dbResults: ResultSet = await getDbConnection(true).execute({
		sql: "UPDATE videos SET name = ?, description = ?, thumbnailURL = ?, videoURL = ?, dateReleased = ?, urlName = ?, ageRating = ?, category = ?, videoURLKey = ?, thumbnailURLKey = ?, isPartOfTVShow = ?, tvShowId = ? WHERE id = ?;",
		args: [
			data.name,
			data.description,
			data.thumbnailURL,
			data.videoURL,
			data.date,
			data.urlName,
			data.ageRating,
			data.category,
			videoUrlKey,
			thumbnailUrlKey,
			data.isPartOfTVShow || "false",
			data.tvShowId || "0",
			data.id,
		],
	});
	return dbResults.rowsAffected > 0;
}

/**
 * This function deletes a video from the database and UploadThing.
 * @param data The data to delete the video.
 * @returns True if the video was deleted, false otherwise.
 */

async function deleteVideo(data: any) {
	const connection = getDbConnection(true);
	const dbGetResults: ResultSet = await connection.execute({
		sql: "SELECT * FROM videos WHERE id = ?",
		args: [data.id],
	});
	if (dbGetResults.rows.length === 0) {
		return false;
	}
	const videoUrlKey = dbGetResults.rows[0].videoURLKey as string;
	const thumbnailUrlKey = dbGetResults.rows[0].thumbnailURLKey as string;
	await utapi.deleteFiles(thumbnailUrlKey);
	await utapi.deleteFiles(videoUrlKey);
	const dbDeleteResults: ResultSet = await connection.execute({
		sql: "DELETE FROM videos WHERE id = ?",
		args: [data.id],
	});
	return dbDeleteResults.rowsAffected > 0;
}

/**
 * This function gets a video from the database.
 * @param id The id of the video.
 * @returns The video or null if it doesn't exist.
 */

async function getVideo(id: string) {
	const dbGetResults: ResultSet = await getDbConnection(false).execute({
		sql: "SELECT * FROM videos WHERE id = ?",
		args: [id],
	});
	if (dbGetResults.rows.length === 0) {
		return null;
	}
	return dbGetResults.rows[0];
}

export { getVideos, getVideosForSearch, addVideo, updateVideo, deleteVideo, getVideo };
