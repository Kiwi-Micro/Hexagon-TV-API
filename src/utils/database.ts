import { ResultSet } from "@libsql/client";
import { getDbConnection, clerkClient, utapi } from "./connections";
import { VideoUpdate } from "./types";

/**
 * Formats the videos from the database.
 * @param dbResults The videos from the database results.
 * @returns The formatted videos.
 */

async function parseVideos(dbResults: any) {
	const rows = dbResults.rows || [];
	// Create a map of ratings.
	const ratings = {
		G: "Suitable for all ages",
		PG: "Some material may not be suitable for children",
		CTC: "Check the classification closer to its release date",
	};
	// Create a type for the rating keys.
	type RatingKey = keyof typeof ratings;
	// Create an array of videos.
	const results = rows.map((row: any) => ({
		id: row.id,
		name: row.name,
		description: row.description,
		thumbnailURL: row.thumbnailURL,
		videoURL: row.videoURL,
		date: row.date,
		urlName: row.urlName,
		ageRating: row.rating,
		ageRatingInfo: ratings[row.rating as RatingKey] || "Age Rating not found",
		category: row.category,
		videoUrlKey: row.videoURLKey,
		thumbnailUrlKey: row.thumbnailURLKey,
	}));
	// Return the videos.
	return results;
}

/**
 * Gets all videos from the database that match the query.
 * @param query The query to search for.
 * @returns An array of videos.
 */

async function getVideosForSearch(query: string) {
	// Get all videos from the database that match the query.
	const dbResults: ResultSet = await getDbConnection(true).execute({
		sql: "SELECT * FROM videos WHERE name LIKE ?",
		args: [`%${query}%`],
	});
	// Parse the videos and return them.
	return parseVideos(dbResults);
}

/**
 * Gets all videos from the database.
 * @returns An array of videos.
 */

async function getVideos() {
	// Get all videos from the database.
	const dbResults: ResultSet = await getDbConnection(true).execute(
		"SELECT * FROM videos",
	);
	// Parse the videos and return them.
	return parseVideos(dbResults);
}

/**
 * This function adds a video to the database.
 * @param data The data to add the video.
 * @returns True if the video was added, false otherwise.
 */

async function addVideo(data: any) {
	// Get the current date.
	const date = Date().toString().split("T")[0];
	// Insert the video into the database.
	const dbResults: ResultSet = await getDbConnection(false).execute({
		sql: "INSERT INTO videos (name, description, thumbnailURL, videoURL, date, urlName, rating, category, videoURLKey, thumbnailURLKey) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
		args: [
			data.name,
			data.description,
			data.thumbnailURL,
			data.videoURL,
			date,
			data.urlName,
			data.ageRating,
			data.category,
			data.videoURL.split("/f/").pop(),
			data.thumbnailURL.split("/f/").pop(),
		],
	});
	// Return true if the video was added.
	return dbResults.rowsAffected > 0;
}

/**
 * This function updates a video in the database.
 * @param data The data to update the video.
 * @returns True if the video was updated, false otherwise.
 */

async function updateVideo(data: VideoUpdate) {
	// Get the video URL key and thumbnail URL key.
	const videoUrlKey = data.videoURL.split("/f/").pop() || "";
	const thumbnailUrlKey = data.thumbnailURL.split("/f/").pop() || "";
	// Update the video in the database.
	const dbResults: ResultSet = await getDbConnection(false).execute({
		sql: "UPDATE videos SET name = ?, description = ?, thumbnailURL = ?, videoURL = ?, date = ?, urlName = ?, rating = ?, category = ?, videoURLKey = ?, thumbnailURLKey = ? WHERE urlName = ?;",
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
			data.currentUrlName,
		],
	});
	// Return true if the video was updated.
	return dbResults.rowsAffected > 0;
}

/**
 * This function deletes a video from the database and UploadThing.
 * @param data The data to delete the video.
 * @returns True if the video was deleted, false otherwise.
 */

async function deleteVideo(data: any) {
	const urlName = data.urlName;

	const dbGetResults: ResultSet = await getDbConnection(true).execute({
		sql: "SELECT * FROM videos WHERE urlName = ?",
		args: [urlName],
	});
	// Check if the video exists.
	if (dbGetResults.rows.length === 0) {
		return false;
	}
	// Get the video URL key and thumbnail URL key.
	const videoUrlKey = dbGetResults.rows[0].videoURLKey as string;
	const thumbnailUrlKey = dbGetResults.rows[0].thumbnailURLKey as string;
	// Delete the video from UploadThing.
	await utapi.deleteFiles(thumbnailUrlKey);
	await utapi.deleteFiles(videoUrlKey);
	// Delete the video from the database.
	const dbDeleteResults: ResultSet = await getDbConnection(false).execute({
		sql: "DELETE FROM videos WHERE urlName = ?",
		args: [urlName],
	});
	// Return true if the video was deleted.
	return dbDeleteResults.rowsAffected > 0;
}

/**
 * This function checks if the user is authenticated.
 * @param sessionId The session ID of the user.
 * @param userId The user ID of the user.
 * @param username The username of the user.
 * @param usernameOverride Whether to allow the user to authenticate even if their username is not the same.
 * @returns True if the user is authenticated, false otherwise.
 */

async function auth(
	sessionId: string,
	userId: string,
	username: string,
	usernameOverride?: boolean,
) {
	try {
		const status = "active";
		// Get the list of sessions for the user of the given status.
		const sessions = await clerkClient.sessions.getSessionList({
			userId,
			status,
		});

		// Check if the user has any sessions with the given status.
		if (sessions.totalCount === 0) {
			return false;
		}
		// Loop through the sessions and check if the sessionId matches.
		for (const session of sessions.data) {
			if (session.id === sessionId) {
				return true;
			}
		}

		// Get the user object for the userId given.
		const user = await clerkClient.users.getUser(userId);
		const registeredUsername = user.username;
		// if the username override is true, we will allow the user to authenticate even if their username is not the same.
		if (!usernameOverride) {
			// Check if the username matches the given username.
			if (registeredUsername !== username) {
				return false;
			}
		}
		return false;
	} catch (error: any) {
		// Check if the error is that the user is not found as it is not a server error.
		if (error.status === 404) {
			return false;
		}
		// Log the error.
		console.error("Error authenticating:", error);
		return false;
	}
}

/**
 * This function checks if the user is an admin.
 * @param sessionId The session ID of the user.
 * @param userId The user ID of the user.
 * @returns True if the user is an admin, false otherwise.
 */

async function adminAuth(sessionId: string, userId: string) {
	try {
		const dbGetResults: ResultSet = await getDbConnection(true).execute({
			sql: "SELECT * FROM userPermissions WHERE isAdmin = 'true' AND userId = ?",
			args: [userId],
		});

		if (dbGetResults.rows.length === 0) {
			// Return false if the user is not an admin and escape early.
			return false;
		}

		// Return true if the user is logged in.
		return auth(sessionId, userId, "", true);
	} catch (error: any) {
		// Check if the error is that the user is not found as it is not a server error.
		if (error.status === 404) {
			return false;
		}
		// Log the error.
		console.error("Error authenticating:", error);
		return false;
	}
}

export {
	getVideos,
	getVideosForSearch,
	addVideo,
	updateVideo,
	deleteVideo,
	auth,
	adminAuth,
};
