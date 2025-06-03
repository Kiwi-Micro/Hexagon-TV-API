import { ResultSet } from "@libsql/client";
import { utapi } from "./connections";
import { parseTVShows, type TVShow } from "./types";
import { runSQL } from "./database";

/**
 * Gets all TV Shows from the database with user specific data.
 * @param userId The userId of the user to get the TV Shows for.
 * @returns An array of TV Shows.
 */

async function getTVShows(userId: string): Promise<TVShow[]> {
	const dbResults: ResultSet = await runSQL(false, "SELECT * FROM tvShows", false);
	return parseTVShows(dbResults, userId);
}

/**
 * This function gets a TV Show from the database.
 * @param id The id of the TV Show.
 * @param userId The userId of the user to get the TV Show for.
 * @returns The TV Show or null if it doesn't exist.
 */

async function getTVShow(id: number, userId: string): Promise<TVShow | null> {
	const dbResults: ResultSet = await runSQL(
		false,
		"SELECT * FROM tvShows WHERE id = ?",
		true,
		[id],
	);
	if (dbResults.rows.length === 0) {
		return null;
	}
	return (await parseTVShows(dbResults, userId))[0];
}

/**
 * This function adds a TV Show to the database.
 * @param data The data to add the TV Show.
 * @returns True if the TV Show was added, false otherwise.
 */

async function addTVShow(data: TVShow): Promise<boolean> {
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
	return dbResults.rowsAffected > 0;
}

/**
 * This function updates a TV Show in the database.
 * @param data The data to update the TV Show.
 * @returns True if the TV Show was updated, false otherwise.
 */

async function updateTVShow(data: TVShow): Promise<boolean> {
	const tvShowData = await getTVShow(data.id, "");
	if (tvShowData == null) {
		return false;
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

	return dbResults.rowsAffected > 0;
}

/**
 * This function deletes a TV Show from the database and UploadThing.
 * @param data The data to delete the TV Show.
 * @returns True if the TV Show was deleted, false otherwise.
 */

async function deleteTVShow(data: any): Promise<boolean> {
	const dbGetResults: ResultSet = await runSQL(
		false,
		"SELECT * FROM tvShows WHERE id = ?",
		true,
		[data.id],
	);
	if (dbGetResults.rows.length === 0) {
		return false;
	}
	const thumbnailUrlKey = dbGetResults.rows[0].thumbnailURLKey as string;
	await utapi.deleteFiles(thumbnailUrlKey);
	const dbDeleteResults: ResultSet = await runSQL(
		true,
		"DELETE FROM tVShows WHERE id = ?",
		true,
		[data.id],
	);
	return dbDeleteResults.rowsAffected > 0;
}

export { getTVShows, getTVShow, addTVShow, updateTVShow, deleteTVShow };
