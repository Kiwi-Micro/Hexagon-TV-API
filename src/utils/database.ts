import { ResultSet } from "@libsql/client";
import { getDbConnection } from "./databaseConnection";
import { createClerkClient } from "@clerk/backend";
import config from "../../config.json";
import { VideoUpdate } from "./types";

import { UTApi } from "uploadthing/server";
import { use } from "react";

export const utapi = new UTApi({
	token: config[0]["UPLOADTHING_TOKEN"],
});

const CLERK_SECRET_KEY = config[0]["CLERK_SECRET_KEY"];
const clerkClient = createClerkClient({
	secretKey: CLERK_SECRET_KEY,
});

async function parseVideos(dbResults: any) {
	const rows = dbResults.rows || [];

	const ratings = {
		G: "Suitable for all ages",
		PG: "Some material may not be suitable for children",
		CTC: "Check the classification closer to its release date",
	};

	type RatingKey = keyof typeof ratings;

	const results = rows.map((row: any) => ({
		id: row[0],
		name: row[1],
		description: row[2],
		thumbnailURL: row[3],
		videoURL: row[4],
		date: row[5],
		urlName: row[6],
		ageRating: row[7],
		ageRatingInfo: ratings[row[7] as RatingKey] || "Age Rating not found",
		category: row[8],
		videoUrlKey: row[9],
		thumbnailUrlKey: row[10],
	}));

	return results;
}

async function getVideosForSearch(query: string) {
	const dbResults: ResultSet = await getDbConnection(true).execute({
		sql: "SELECT * FROM videos WHERE name LIKE ?",
		args: [`%${query}%`],
	});

	return parseVideos(dbResults);
}

async function getVideos() {
	const dbResults: ResultSet = await getDbConnection(true).execute(
		"SELECT * FROM videos",
	);

	return parseVideos(dbResults);
}

async function addVideo(data: any) {
	const date = Date().toString().split("T")[0];
	const videoUrlKey = data.videoURL.split("/f/").pop();
	const thumbnailUrlKey = data.thumbnailURL.split("/f/").pop();
	const dbResults: ResultSet = await getDbConnection(false).execute({
		sql: "INSERT INTO videos (name, description, thumbnailURL, videoURL, date, urlName, rating, category, videoUrlKey, thumbnailUrlKey) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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

	return dbResults.rowsAffected > 0;
}

async function updateVideo(data: VideoUpdate) {
	const date = Date().toString().split("T")[0];
	const dbResults: ResultSet = await getDbConnection(false).execute({
		sql: "UPDATE videos SET name = ?, description = ?, thumbnailURL = ?, videoURL = ?, date = ?, urlName = ?, rating = ?, category = ? WHERE urlName = ?;",
		args: [
			data.name,
			data.description,
			data.thumbnailURL,
			data.videoURL,
			date,
			data.urlName,
			data.ageRating,
			data.category,
			data.currentUrlName,
		],
	});

	return dbResults.rowsAffected > 0;
}

async function deleteVideo(data: any) {
	const urlName = data.urlName;

	const dbGetResults: ResultSet = await getDbConnection(true).execute({
		sql: "SELECT * FROM videos WHERE urlName = ?",
		args: [urlName],
	});

	if (dbGetResults.rows.length === 0) {
		return false;
	}

	const videoUrlKey = dbGetResults.rows[0][9] as string;
	const thumbnailUrlKey = dbGetResults.rows[0][10] as string;

	await utapi.deleteFiles(thumbnailUrlKey);
	await utapi.deleteFiles(videoUrlKey);
	const dbDeleteResults: ResultSet = await getDbConnection(false).execute({
		sql: "DELETE FROM videos WHERE urlName = ?",
		args: [urlName],
	});

	return dbDeleteResults.rowsAffected > 0;
}

async function auth(sessionId: string, userId: string, username: string) {
	try {
		const status = "active";
		const sessions = await clerkClient.sessions.getSessionList({
			userId,
			status,
		});
		const user = await clerkClient.users.getUser(userId);
		const registeredUsername = user.username;
		if (registeredUsername !== username) {
			return false;
		}
		if (sessions.totalCount === 0) {
			return false;
		}
		for (const session of sessions.data) {
			if (session.id === sessionId) {
				return true;
			}
		}
		return false;
	} catch (error: any) {
		if (error.status === 404) {
			return false;
		}
		console.error("Error authenticating:", error);
		return false;
	}
}

async function adminAuth(sessionId: string, userId: string) {
	try {
		const dbGetResults: ResultSet = await getDbConnection(true).execute({
			sql: "SELECT * FROM userPermissions WHERE isAdmin = 'true' AND userId = ?",
			args: [userId],
		});

		if (dbGetResults.rows.length === 0) {
			return false;
		}

		const user = await clerkClient.users.getUser(userId);
		const registeredUsername = user.username || "";

		let isAuthenticated = auth(sessionId, userId, registeredUsername);

		return isAuthenticated;
	} catch (error: any) {
		if (error.status === 404) {
			return false;
		}
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
