import { ResultSet } from "@libsql/client";
import { utapi } from "./connections";
import { parseVideos, type Video } from "./types";
import { runSQL } from "./database";

/**
 * Gets all videos from the database with user specific data.
 * @param userId The userId of the user to get the videos for.
 * @returns An array of videos.
 */

async function getVideos(userId: string): Promise<Video[]> {
	const dbResults: ResultSet = await runSQL(false, "SELECT * FROM videos", false);
	return parseVideos(dbResults, userId);
}

/**
 * This function gets a video from the database.
 * @param id The id of the video.
 * @returns The video or null if it doesn't exist.
 */

async function getVideo(id: number, userId: string): Promise<Video | null> {
	const dbResults: ResultSet = await runSQL(
		false,
		"SELECT * FROM videos WHERE id = ?",
		true,
		[id],
	);
	if (dbResults.rows.length === 0) {
		return null;
	}
	return (await parseVideos(dbResults, userId))[0];
}

/**
 * This function adds a video to the database.
 * @param data The data to add the video.
 * @returns True if the video was added, false otherwise.
 */

async function addVideo(data: Video): Promise<boolean> {
	const dbResults: ResultSet = await runSQL(
		true,
		"INSERT INTO videos (name, description, thumbnailURL, videoURL, dateReleased, urlName, ageRating, category, videoURLKey, thumbnailURLKey, isPartOfTVShow, tvShowId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		true,
		[
			data.name,
			data.description,
			data.thumbnailURL,
			data.videoURL,
			data.dateReleased,
			data.urlName,
			data.ageRating,
			data.category,
			data.videoURL.split("/f/").pop() || "",
			data.thumbnailURL.split("/f/").pop() || "",
			data.isPartOfTVShow || 0,
			data.tvShowId || 0,
		],
	);
	return dbResults.rowsAffected > 0;
}

/**
 * This function updates a video in the database.
 * @param data The data to update the video.
 * @returns True if the video was updated, false otherwise.
 */

async function updateVideo(data: Video): Promise<boolean> {
	const videoData = await getVideo(data.id, "");
	if (videoData == null) {
		return false;
	}

	const videoUrlKey = data.videoURL
		? data.videoURL.split("/f/").pop() || ""
		: videoData.videoURLKey || "";

	const thumbnailUrlKey = data.thumbnailURL
		? data.thumbnailURL.split("/f/").pop() || ""
		: videoData.thumbnailURLKey || "";

	const dbResults: ResultSet = await runSQL(
		true,
		"UPDATE videos SET name = ?, description = ?, thumbnailURL = ?, videoURL = ?, dateReleased = ?, urlName = ?, ageRating = ?, category = ?, videoURLKey = ?, thumbnailURLKey = ?, isPartOfTVShow = ?, tvShowId = ? WHERE id = ?;",
		true,
		[
			data.name || videoData.name,
			data.description || videoData.description,
			data.thumbnailURL || videoData.thumbnailURL,
			data.videoURL || videoData.videoURL,
			data.dateReleased || videoData.dateReleased,
			data.urlName || videoData.urlName,
			data.ageRating || videoData.ageRating,
			data.category || videoData.category,
			videoUrlKey,
			thumbnailUrlKey,
			data.isPartOfTVShow || videoData.isPartOfTVShow || 0,
			data.tvShowId || videoData.tvShowId || 0,
			data.id,
		],
	);
	return dbResults.rowsAffected > 0;
}

/**
 * This function deletes a video from the database and UploadThing.
 * @param data The data to delete the video.
 * @returns True if the video was deleted, false otherwise.
 */

async function deleteVideo(data: any): Promise<boolean> {
	const dbGetResults: ResultSet = await runSQL(
		false,
		"SELECT * FROM videos WHERE id = ?",
		true,
		[data.id],
	);
	if (dbGetResults.rows.length === 0) {
		return false;
	}
	const videoUrlKey = dbGetResults.rows[0].videoURLKey as string;
	const thumbnailUrlKey = dbGetResults.rows[0].thumbnailURLKey as string;
	await utapi.deleteFiles(thumbnailUrlKey);
	await utapi.deleteFiles(videoUrlKey);
	const dbDeleteResults: ResultSet = await runSQL(
		true,
		"DELETE FROM videos WHERE id = ?",
		true,
		[data.id],
	);
	return dbDeleteResults.rowsAffected > 0;
}

export { getVideos, getVideo, addVideo, updateVideo, deleteVideo };
