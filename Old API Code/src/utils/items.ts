import { Item, parseItems, ReturnData } from "./types";
import { ResultSet } from "@libsql/client";
import { utapi } from "./connections";
import { runSQL } from "./database";

/**
 * This function searches for items that match the query.
 * @param query The query to search for.
 * @param userId The userId of the user who is searching.
 * @returns An array of items.
 */

export async function search(
	query: string,
	userId: string,
	type: string,
): Promise<ReturnData<Item[]>> {
	try {
		const dbResults: ResultSet = await runSQL(
			false,
			"SELECT * FROM items WHERE name LIKE ? AND type LIKE ? AND type != 'episode'",
			true,
			[`%${query}%`, type === "all" ? "%" : type],
		);

		return {
			status: "success",
			httpStatus: 200,
			analyticsEventType: "api.items.search",
			data: await parseItems(dbResults, userId),
		};
	} catch (error: any) {
		console.error("Error searching:", error);
		return {
			status: "server error",
			httpStatus: 500,
			analyticsEventType: "api.search.search.failed",
			data: null,
		};
	}
}

/**
 * Gets all items from the database with user specific data.
 * @param userId The userId of the user to get the items for.
 * @returns An array of items.
 */

export async function getItems(
	userId: string,
	type: string,
): Promise<ReturnData<Item[]>> {
	try {
		const dbResults: ResultSet = await runSQL(
			false,
			"SELECT * FROM items WHERE type LIKE ? AND type != 'episode'",
			true,
			[type === "all" ? "%" : type],
		);

		return {
			status: "success",
			httpStatus: 200,
			analyticsEventType: "api.items.getItems",
			data: await parseItems(dbResults, userId),
		};
	} catch (error: any) {
		console.error("Error getting items:", error);
		return {
			status: "server error",
			httpStatus: 500,
			analyticsEventType: "api.items.getItems.failed",
			data: null,
		};
	}
}

/**
 * This function gets a item from the database.
 * @param id The id of the item.
 * @returns The item or null if it doesn't exist.
 */

export async function getItem(id: number, userId: string): Promise<ReturnData<Item>> {
	try {
		const dbResults: ResultSet = await runSQL(
			false,
			"SELECT * FROM items WHERE id = ?",
			true,
			[id],
		);

		if (dbResults.rows.length === 0) {
			return {
				status: "item not found",
				httpStatus: 404,
				analyticsEventType: "api.items.getItem.failed",
				data: null,
			};
		}

		return {
			status: "success",
			httpStatus: 200,
			analyticsEventType: "api.items.getItem",
			data: (await parseItems(dbResults, userId))[0],
		};
	} catch (error: any) {
		console.error("Error getting item:", error);
		return {
			status: "server error",
			httpStatus: 500,
			analyticsEventType: "api.items.getItem.failed",
			data: null,
		};
	}
}

/**
 * This function adds an item to the database.
 * @param data The data to add the item.
 * @returns True if the item was added, false otherwise.
 */

export async function addItem(data: Item): Promise<ReturnData<null>> {
	try {
		const dbResults: ResultSet = await runSQL(
			true,
			"INSERT INTO items (name, description, urlName, thumbnailURL, thumbnailURLKey, dateReleased, ageRating, category, videoURL, videoURLKey, isPartOfTVShow, tvShowId, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
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
				data.videoURL || "",
				data.videoURL.split("/f/").pop() || "",
				data.isPartOfTVShow || 0,
				data.tvShowId || 0,
				data.type,
			],
		);
		return dbResults.rowsAffected > 0
			? {
					status: "success",
					httpStatus: 200,
					analyticsEventType: "api.items.addItem",
					data: null,
			  }
			: {
					status: "server error",
					httpStatus: 500,
					analyticsEventType: "api.items.addItem.failed",
					data: null,
			  };
	} catch (error: any) {
		console.error("Error adding item:", error);
		return {
			status: "server error",
			httpStatus: 500,
			analyticsEventType: "api.items.addItem.failed",
			data: null,
		};
	}
}

/**
 * This function updates a item in the database.
 * @param data The data to update the item.
 * @returns True if the item was updated, false otherwise.
 */

export async function updateItem(data: Item): Promise<ReturnData<null>> {
	try {
		const itemData = (await getItem(data.id, "")).data;
		if (itemData == null) {
			return {
				status: "item not found",
				httpStatus: 404,
				analyticsEventType: "api.items.updateItem.failed",
				data: null,
			};
		}

		const dbResults: ResultSet = await runSQL(
			true,
			"UPDATE items SET name = ?, description = ?, urlName = ?, thumbnailURL = ?, thumbnailURLKey = ?, dateReleased = ?, ageRating = ?, category = ?, videoURL = ?, videoURLKey = ?, isPartOfTVShow = ?, tvShowId = ?, type = ? WHERE id = ?;",
			true,
			[
				data.name || itemData.name,
				data.description || itemData.description,
				data.urlName || itemData.urlName,
				data.thumbnailURL || itemData.thumbnailURL,
				data.thumbnailURL
					? data.thumbnailURL.split("/f/").pop() || ""
					: itemData.thumbnailURLKey || "",
				data.dateReleased || itemData.dateReleased,
				data.ageRating || itemData.ageRating,
				data.category || itemData.category,
				data.videoURL || itemData.videoURL,
				data.videoURL
					? data.videoURL.split("/f/").pop() || ""
					: itemData.videoURLKey || "",
				data.isPartOfTVShow || itemData.isPartOfTVShow || 0,
				data.tvShowId || itemData.tvShowId || 0,
				data.type || itemData.type,
				data.id,
			],
		);
		return dbResults.rowsAffected > 0
			? {
					status: "success",
					httpStatus: 200,
					analyticsEventType: "api.items.updateItem",
					data: null,
			  }
			: {
					status: "server error",
					httpStatus: 500,
					analyticsEventType: "api.items.updateItem.failed",
					data: null,
			  };
	} catch (error: any) {
		console.error("Error updating item:", error);
		return {
			status: "server error",
			httpStatus: 500,
			analyticsEventType: "api.items.updateItem.failed",
			data: null,
		};
	}
}

/**
 * This function deletes a item from the database and UploadThing.
 * @param data The data to delete the item.
 * @returns True if the item was deleted, false otherwise.
 */

export async function deleteItem(data: Item): Promise<ReturnData<null>> {
	try {
		const dbGetResults: ResultSet = await runSQL(
			false,
			"SELECT * FROM items WHERE id = ?",
			true,
			[data.id],
		);
		if (dbGetResults.rows.length === 0) {
			return {
				status: "item not found",
				httpStatus: 404,
				analyticsEventType: "api.items.deleteItem.failed",
				data: null,
			};
		}
		const videoUrlKey = dbGetResults.rows[0].videoURLKey as string;
		const thumbnailUrlKey = dbGetResults.rows[0].thumbnailURLKey as string;
		await utapi.deleteFiles(thumbnailUrlKey);
		await utapi.deleteFiles(videoUrlKey);
		const dbDeleteResults: ResultSet = await runSQL(
			true,
			"DELETE FROM items WHERE id = ?",
			true,
			[data.id],
		);
		return dbDeleteResults.rowsAffected > 0
			? {
					status: "success",
					httpStatus: 200,
					analyticsEventType: "api.items.deleteItem",
					data: null,
			  }
			: {
					status: "server error",
					httpStatus: 500,
					analyticsEventType: "api.items.deleteItem.failed",
					data: null,
			  };
	} catch (error: any) {
		console.error("Error deleting item:", error);
		return {
			status: "server error",
			httpStatus: 500,
			analyticsEventType: "api.items.deleteItem.failed",
			data: null,
		};
	}
}
