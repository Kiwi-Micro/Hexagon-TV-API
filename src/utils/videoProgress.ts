import { ResultSet } from "@libsql/client";
import { parseVideoProgress, type VideoProgress } from "./types";
import { runSQL } from "./database";

async function addUserVideoProgressRow(
	userId: string,
	videoId: string,
): Promise<boolean> {
	const dbResults: ResultSet = await runSQL(
		true,
		"INSERT INTO continueWatching (userId, videoId, progressThroughVideo, isVideoCompleted) VALUES (?, ?, 0, 0)",
		true,
		[userId, videoId],
	);
	return dbResults.rowsAffected > 0;
}

async function updateUserVideoProgress(data: VideoProgress): Promise<boolean> {
	await addUserVideoProgressRow(data.userId, data.videoId);
	const dbResults: ResultSet = await runSQL(
		true,
		"UPDATE continueWatching SET progressThroughVideo = ?, isVideoCompleted = ? WHERE userId = ? AND videoId = ?;",
		true,
		[data.progressThroughVideo, data.isVideoCompleted, data.userId, data.videoId],
	);
	return dbResults.rowsAffected > 0;
}

async function getUserVideoProgress(
	userId: string,
	videoId: string,
): Promise<VideoProgress> {
	const dbResults: ResultSet = await runSQL(
		false,
		"SELECT * FROM continueWatching WHERE userId = ? AND videoId = ?",
		true,
		[userId, videoId],
	);
	return parseVideoProgress(dbResults)[0];
}

export { addUserVideoProgressRow, updateUserVideoProgress, getUserVideoProgress };
