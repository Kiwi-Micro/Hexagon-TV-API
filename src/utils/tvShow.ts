import { ResultSet } from "@libsql/client";
import { utapi } from "./connections";
import { parseTVShows, ReturnData, type TVShow } from "./types";
import { runSQL } from "./database";

/**
 * Gets all TV Shows from the database with user specific data.
 * @param userId The userId of the user to get the TV Shows for.
 * @returns An array of TV Shows.
 */

export async function getTVShows(userId: string): Promise<ReturnData> {
	try {
		const dbResults: ResultSet = await runSQL(false, "SELECT * FROM tvShows", false);
		return {
			status: "success",
			httpStatus: 200,
			analyticsEventType: "api.tvShows.getTVShows",
			data: parseTVShows(dbResults, userId),
		};
	} catch (error: any) {
		console.error("Error getting TV Shows:", error);
		return {
			status: "server error",
			httpStatus: 500,
			analyticsEventType: "api.tvShows.getTVShows.failed",
			data: null,
		};
	}
}

/**
 * This function gets a TV Show from the database.
 * @param id The id of the TV Show.
 * @param userId The userId of the user to get the TV Show for.
 * @returns The TV Show or null if it doesn't exist.
 */

export async function getTVShow(id: number, userId: string): Promise<ReturnData> {
	try {
		const dbResults: ResultSet = await runSQL(
			false,
			"SELECT * FROM tvShows WHERE id = ?",
			true,
			[id],
		);
		if (dbResults.rows.length === 0) {
			return {
				status: "tv show not found",
				httpStatus: 404,
				analyticsEventType: "api.tvShows.getTVShow.failed",
				data: null,
			};
		}
		return {
			status: "success",
			httpStatus: 200,
			analyticsEventType: "api.tvShows.getTVShow",
			data: (await parseTVShows(dbResults, userId))[0],
		};
	} catch (error: any) {
		console.error("Error getting TV Show:", error);
		return {
			status: "server error",
			httpStatus: 500,
			analyticsEventType: "api.tvShows.getTVShow.failed",
			data: null,
		};
	}
}

/**
 * This function adds a TV Show to the database.
 * @param data The data to add the TV Show.
 * @returns True if the TV Show was added, false otherwise.
 */

export async function addTVShow(data: TVShow): Promise<ReturnData> {
	try {
		const dbResults: ResultSet = await runSQL(
			true,
			"INSERT INTO tvShows (name, description, urlName, thumbnailURL, thumbnailURLKey, dateReleased, ageRating, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
			true,
			[
				data.name,
				data.description,
				data.urlName,
				data.thumbnailURL,
				data.thumbnailURL.split("/f/").pop() || "",
				data.dateReleased,
				data.ageRating,
				data.category,
			],
		);
		return dbResults.rowsAffected > 0
			? {
					status: "success",
					httpStatus: 200,
					analyticsEventType: "api.tvShows.addTVShow",
					data: null,
			  }
			: {
					status: "server error",
					httpStatus: 500,
					analyticsEventType: "api.tvShows.addTVShow.failed",
					data: null,
			  };
	} catch (error: any) {
		console.error("Error adding TV Show:", error);
		return {
			status: "server error",
			httpStatus: 500,
			analyticsEventType: "api.tvShows.addTVShow.failed",
			data: null,
		};
	}
}

/**
 * This function updates a TV Show in the database.
 * @param data The data to update the TV Show.
 * @returns True if the TV Show was updated, false otherwise.
 */

export async function updateTVShow(data: TVShow): Promise<ReturnData> {
	try {
		const tvShowData = (await getTVShow(data.id, "")).data;
		if (tvShowData == null) {
			return {
				status: "tv show not found",
				httpStatus: 404,
				analyticsEventType: "api.tvShows.updateTVShow.failed",
				data: null,
			};
		}

		const thumbnailUrlKey = data.thumbnailURL
			? data.thumbnailURL.split("/f/").pop() || ""
			: tvShowData.thumbnailURLKey || "";

		const dbResults: ResultSet = await runSQL(
			true,
			"UPDATE tvShows SET name = ?, description = ?, urlName = ?, thumbnailURL = ?, thumbnailURLKey = ?, dateReleased = ?, ageRating = ?, category = ? WHERE id = ?;",
			true,
			[
				data.name || tvShowData.name,
				data.description || tvShowData.description,
				data.urlName || tvShowData.urlName,
				data.thumbnailURL || tvShowData.thumbnailURL,
				thumbnailUrlKey,
				data.dateReleased || tvShowData.dateReleased,
				data.ageRating || tvShowData.ageRating,
				data.category || tvShowData.category,
				data.id,
			],
		);

		return dbResults.rowsAffected > 0
			? {
					status: "success",
					httpStatus: 200,
					analyticsEventType: "api.tvShows.updateTVShow",
					data: null,
			  }
			: {
					status: "server error",
					httpStatus: 500,
					analyticsEventType: "api.tvShows.updateTVShow.failed",
					data: null,
			  };
	} catch (error: any) {
		console.error("Error updating TV Show:", error);
		return {
			status: "server error",
			httpStatus: 500,
			analyticsEventType: "api.tvShows.updateTVShow.failed",
			data: null,
		};
	}
}

/**
 * This function deletes a TV Show from the database and UploadThing.
 * @param data The data to delete the TV Show.
 * @returns True if the TV Show was deleted, false otherwise.
 */

export async function deleteTVShow(data: any): Promise<ReturnData> {
	try {
		const dbGetResults: ResultSet = await runSQL(
			false,
			"SELECT * FROM tvShows WHERE id = ?",
			true,
			[data.id],
		);
		if (dbGetResults.rows.length === 0) {
			return {
				status: "tv show not found",
				httpStatus: 404,
				analyticsEventType: "api.tvShows.deleteTVShow.failed",
				data: null,
			};
		}
		const thumbnailUrlKey = dbGetResults.rows[0].thumbnailURLKey as string;
		await utapi.deleteFiles(thumbnailUrlKey);
		const dbDeleteResults: ResultSet = await runSQL(
			true,
			"DELETE FROM tVShows WHERE id = ?",
			true,
			[data.id],
		);
		return dbDeleteResults.rowsAffected > 0
			? {
					status: "success",
					httpStatus: 200,
					analyticsEventType: "api.tvShows.deleteTVShow",
					data: null,
			  }
			: {
					status: "server error",
					httpStatus: 500,
					analyticsEventType: "api.tvShows.deleteTVShow.failed",
					data: null,
			  };
	} catch (error: any) {
		console.error("Error deleting TV Show:", error);
		return {
			status: "server error",
			httpStatus: 500,
			analyticsEventType: "api.tvShows.deleteTVShow.failed",
			data: null,
		};
	}
}
