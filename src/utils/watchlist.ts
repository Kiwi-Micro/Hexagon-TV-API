import { ResultSet } from "@libsql/client";
import { parseItems, parseWatchlist, ReturnData, type Watchlist } from "./types";
import { runSQL } from "./database";

/**
 * Gets the watchlist for a given user.
 * @param userId The userId of the user that we want to get the watchlist for.
 * @returns The watchlist for the user.
 */

export async function getWatchlist(userId: string): Promise<ReturnData<Watchlist[]>> {
	try {
		const dbResults: ResultSet = await runSQL(
			false,
			"SELECT * FROM watchlist WHERE userId = ?",
			true,
			[userId],
		);

		const itemsResults: ResultSet = await runSQL(
			false,
			"SELECT * FROM items WHERE id IN (SELECT itemId FROM watchlist WHERE userId = ?)",
			true,
			[userId],
		);

		return {
			status: "success",
			httpStatus: 200,
			analyticsEventType: "api.watchlist.getWatchlist",
			data: parseWatchlist(dbResults, itemsResults),
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

export async function addToWatchlist(item: Watchlist): Promise<ReturnData<null>> {
	try {
		if (!item.userId || !item.itemId) {
			return {
				status: "missing parameters",
				httpStatus: 400,
				analyticsEventType: "api.watchlist.addToWatchlist.failed",
				data: null,
			};
		}

		const itmPromise = parseItems(
			await runSQL(true, "SELECT * FROM items WHERE id = ?", true, [item.itemId]),
			item.userId,
		);

		const itm = await Promise.all(await itmPromise);

		if (itm.length == 0) {
			return {
				status: "item not found",
				httpStatus: 404,
				analyticsEventType: "api.watchlist.addToWatchlist.failed",
				data: null,
			};
		}

		if (itm[0].isPartOfTVShow) {
			const tvShow: Watchlist = {
				id: 0,
				userId: item.userId,
				itemId: itm[0].tvShowId,
			};
			return addToWatchlist(tvShow);
		}

		const dbResults: ResultSet = await runSQL(
			true,
			"INSERT INTO watchlist (userId, itemId) VALUES (?, ?)",
			true,
			[item.userId, item.itemId || 0],
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

export async function deleteFromWatchlist(item: Watchlist): Promise<ReturnData<null>> {
	try {
		if (!item.id || !item.userId) {
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
			[item.id, item.userId],
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
