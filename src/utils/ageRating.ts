import { ResultSet } from "@libsql/client";
import { getDbConnection } from "./connections";

/**
 * This function gets all age ratings from the database.
 * @returns All the age ratings.
 */

async function getAgeRatings() {
	const dbResults: ResultSet = await getDbConnection(false).execute(
		"SELECT * FROM ageRatings",
	);
	if (dbResults.rows.length === 0) {
		console.log("No age ratings found");
		return null;
	}
	return dbResults.rows;
}

/**
 * This function gets the specified age rating from the database.
 * @param ageRating The age rating to get.
 * @returns All the age ratings.
 */

async function getAgeRatingInfo(ageRating: string) {
	const dbGetResults: ResultSet = await getDbConnection(false).execute({
		sql: "SELECT * FROM ageRatings WHERE ageRating = ?",
		args: [ageRating],
	});
	if (dbGetResults.rows.length === 0) {
		console.log("No age rating found");
		return null;
	}
	return dbGetResults.rows[0].ageRatingInfo;
}

/**
 * This function adds an age rating to the database.
 * @param data The data to add the age rating.
 * @returns True if the age rating was added, false otherwise.
 */

async function addAgeRating(data: any) {
	const dbResults: ResultSet = await getDbConnection(true).execute({
		sql: "INSERT INTO ageRatings (ageRating, ageRatingInfo) VALUES (?, ?)",
		args: [data.ageRating, data.ageRatingInfo],
	});
	return dbResults.rowsAffected > 0;
}

/**
 * This function updates an age rating in the database.
 * @param data The data to update the age rating.
 * @returns True if the age rating was updated, false otherwise.
 */

async function updateAgeRating(data: any) {
	const dbResults: ResultSet = await getDbConnection(true).execute({
		sql: "UPDATE ageRatings SET ageRating = ?, ageRatingInfo = ? WHERE id = ?",
		args: [data.ageRating, data.ageRatingInfo, data.id],
	});
	return dbResults.rowsAffected > 0;
}

/**
 * This function deletes an age rating from the database.
 * @param data The data to delete the age rating.
 * @returns True if the age rating was deleted, false otherwise.
 */

async function deleteAgeRating(data: any) {
	const dbResults: ResultSet = await getDbConnection(true).execute({
		sql: "DELETE FROM ageRatings WHERE id = ?",
		args: [data.id],
	});
	return dbResults.rowsAffected > 0;
}

export {
	getAgeRatings,
	getAgeRatingInfo,
	addAgeRating,
	updateAgeRating,
	deleteAgeRating,
};
