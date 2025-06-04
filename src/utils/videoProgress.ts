import { ResultSet } from "@libsql/client";
import { parseVideoProgress, ReturnData, type VideoProgress } from "./types";
import { runSQL } from "./database";

export async function addUserVideoProgressRow(
	userId: string,
	videoId: string,
): Promise<ReturnData> {
	try {
		const dbResults: ResultSet = await runSQL(
			true,
			"INSERT INTO continueWatching (userId, videoId, progressThroughVideo, isVideoCompleted) VALUES (?, ?, 0, 0)",
			true,
			[userId, videoId],
		);
		return dbResults.rowsAffected > 0
			? {
					status: "success",
					httpStatus: 200,
					analyticsEventType: "api.videoProgress.addUserVideoProgressRow",
					data: null,
			  }
			: {
					status: "server error",
					httpStatus: 500,
					analyticsEventType: "api.videoProgress.addUserVideoProgressRow.failed",
					data: null,
			  };
	} catch (error: any) {
		console.error("Error adding user video progress row:", error);
		return {
			status: "server error",
			httpStatus: 500,
			analyticsEventType: "api.videoProgress.addUserVideoProgressRow.failed",
			data: null,
		};
	}
}

export async function updateUserVideoProgress(data: VideoProgress): Promise<ReturnData> {
	try {
		await addUserVideoProgressRow(data.userId, data.videoId);
		const dbResults: ResultSet = await runSQL(
			true,
			"UPDATE continueWatching SET progressThroughVideo = ?, isVideoCompleted = ? WHERE userId = ? AND videoId = ?;",
			true,
			[data.progressThroughVideo, data.isVideoCompleted, data.userId, data.videoId],
		);

		return dbResults.rowsAffected > 0
			? {
					status: "success",
					httpStatus: 200,
					analyticsEventType: "api.videoProgress.updateUserVideoProgress",
					data: null,
			  }
			: {
					status: "server error",
					httpStatus: 500,
					analyticsEventType: "api.videoProgress.updateUserVideoProgress.failed",
					data: null,
			  };
	} catch (error: any) {
		console.error("Error updating user video progress:", error);
		return {
			status: "server error",
			httpStatus: 500,
			analyticsEventType: "api.videoProgress.updateUserVideoProgress.failed",
			data: null,
		};
	}
}

export async function getUserVideoProgress(
	userId: string,
	videoId: string,
): Promise<ReturnData> {
	try {
		const dbResults: ResultSet = await runSQL(
			false,
			"SELECT * FROM continueWatching WHERE userId = ? AND videoId = ?",
			true,
			[userId, videoId],
		);
		if (dbResults.rows.length === 0) {
			return {
				status: "video progress not found",
				httpStatus: 404,
				analyticsEventType: "api.videoProgress.getUserVideoProgress.failed",
				data: null,
			};
		}
		return {
			status: "success",
			httpStatus: 200,
			analyticsEventType: "api.videoProgress.getUserVideoProgress",
			data: parseVideoProgress(dbResults)[0],
		};
	} catch (error: any) {
		console.error("Error getting user video progress:", error);
		return {
			status: "server error",
			httpStatus: 500,
			analyticsEventType: "api.videoProgress.getUserVideoProgress.failed",
			data: null,
		};
	}
}
