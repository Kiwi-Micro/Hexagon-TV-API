import { ResultSet } from "@libsql/client";
import {
	parseTVShows,
	parseVideos,
	parseWatchlist,
	ReturnData,
	type Watchlist,
} from "./types";
import { runSQL } from "./database";

/**
 * Gets the watchlist for a given user.
 * @param userId The userId of the user that we want to get the watchlist for.
 * @returns The watchlist for the user.
 */

export async function getWatchlist(userId: string): Promise<ReturnData> {
	try {
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

		const tvShowResults: ResultSet = await runSQL(
			false,
			"SELECT * FROM tvShows WHERE id IN (SELECT tvShowId FROM watchlist WHERE userId = ?)",
			true,
			[userId],
		);

		const videos = parseWatchlist(dbResults, videoResults, tvShowResults);
		return {
			status: "success",
			httpStatus: 200,
			analyticsEventType: "api.watchlist.getWatchlist",
			data: videos,
		};
	} catch (error: any) {
		console.error("Error getting watchlist:", error);
		return {
			status: "server error",
			httpStatus: 500,
			analyticsEventType: "api.watchlist.getWatchlist.failed",
			data: null,
		};
	}
}

/**
 * Adds a video to the watchlist.
 * @param item The video to add to the watchlist.
 * @returns True if the video was added to the watchlist, false otherwise.
 */

export async function addToWatchlist(item: Watchlist): Promise<ReturnData> {
	try {
		// (item.type == "type" && !item.typeId) is to allow them user to not send the other ID if it will not be used (as set in the `type` flag).
		if (
			!item.userId ||
			!item.type ||
			(item.type == "video" && !item.videoId) ||
			(item.type == "series" && !item.tvShowId)
		) {
			return {
				status: "missing parameters",
				httpStatus: 400,
				analyticsEventType: "api.watchlist.addToWatchlist.failed",
				data: null,
			};
		}

		// If type is series, we need to check if the series exists.
		if (item.type == "series") {
			const seriesPromise = parseTVShows(
				await runSQL(true, "SELECT * FROM tvShows WHERE id = ?", true, [item.tvShowId]),
				item.userId,
			);

			const series = await Promise.all(await seriesPromise);

			if (series.length == 0) {
				return {
					status: "tv show not found",
					httpStatus: 404,
					analyticsEventType: "api.watchlist.addToWatchlist.failed",
					data: null,
				};
			}
		}

		// If type is video, we need to check if the video exists. Also we need to check if the video is part of a TV show and if so, we need to add the TV show to the watchlist instead.
		if (item.type == "video") {
			const videoPromise = parseVideos(
				await runSQL(true, "SELECT * FROM videos WHERE id = ?", true, [item.videoId]),
				item.userId,
			);

			const video = await Promise.all(await videoPromise);

			if (video.length == 0) {
				return {
					status: "video not found",
					httpStatus: 404,
					analyticsEventType: "api.watchlist.addToWatchlist.failed",
					data: null,
				};
			}

			if (video[0].isPartOfTVShow) {
				const tvShow: Watchlist = {
					id: 0,
					userId: item.userId,
					type: "series",
					videoId: 0,
					tvShowId: video[0].tvShowId,
				};
				console.log("7");
				return addToWatchlist(tvShow);
			}
		}

		const dbResults: ResultSet = await runSQL(
			true,
			"INSERT INTO watchlist (userId, type, videoId, tvShowId) VALUES (?, ?, ?, ?)",
			true,
			[item.userId, item.type, item.videoId || 0, item.tvShowId || 0],
		);

		return dbResults.rowsAffected > 0
			? {
					status: "success",
					httpStatus: 200,
					analyticsEventType: "api.watchlist.addToWatchlist",
					data: null,
			  }
			: {
					status: "server error",
					httpStatus: 500,
					analyticsEventType: "api.watchlist.addToWatchlist.failed",
					data: null,
			  };
	} catch (error: any) {
		console.error("Error adding to watchlist:", error);
		return {
			status: "server error",
			httpStatus: 500,
			analyticsEventType: "api.watchlist.addToWatchlist.failed",
			data: null,
		};
	}
}

/**
 * Deletes a video from the given users watchlist.
 * @param video Video to delete from watchlist
 * @returns Returns true if the video was deleted from the watchlist, false otherwise.
 */

export async function deleteFromWatchlist(video: Watchlist): Promise<ReturnData> {
	try {
		if (!video.id || !video.userId) {
			return {
				status: "missing parameters",
				httpStatus: 400,
				analyticsEventType: "api.watchlist.deleteFromWatchlist.failed",
				data: null,
			};
		}

		const dbResults: ResultSet = await runSQL(
			true,
			"DELETE FROM watchlist WHERE id = ? AND userId = ?",
			true,
			[video.id, video.userId],
		);

		return dbResults.rowsAffected > 0
			? {
					status: "success",
					httpStatus: 200,
					analyticsEventType: "api.watchlist.deleteFromWatchlist",
					data: null,
			  }
			: {
					status: "server error",
					httpStatus: 500,
					analyticsEventType: "api.watchlist.deleteFromWatchlist.failed",
					data: null,
			  };
	} catch (error: any) {
		console.error("Error removing from watchlist:", error);
		return {
			status: "server error",
			httpStatus: 500,
			analyticsEventType: "api.watchlist.deleteFromWatchlist.failed",
			data: null,
		};
	}
}
