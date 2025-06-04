import { ResultSet } from "@libsql/client";
import { parseAgeRatings, type ageRating } from "./types";
import { runSQL } from "./database";

/**
 * This function gets all age ratings from the database.
 * @returns All the age ratings.
 */

export async function getAgeRatings(): Promise<ageRating[] | null> {
	const dbResults: ResultSet = await runSQL(false, "SELECT * FROM ageRatings", false);
	if (dbResults.rows.length === 0) {
		console.log("No age ratings found");
		return null;
	}
	return parseAgeRatings(dbResults);
}

/**
 * This function gets the specified age rating from the database.
 * @param ageRating The age rating to get.
 * @returns All the age ratings.
 */

export async function getAgeRatingInfo(ageRating: string): Promise<string | null> {
	const dbResults: ResultSet = await runSQL(
		false,
		"SELECT * FROM ageRatings WHERE ageRating = ?",
		true,
		[ageRating],
	);
	if (dbResults.rows.length === 0) {
		console.log("No age rating found");
		return null;
	}
	return dbResults.rows[0].ageRatingInfo as string;
}
