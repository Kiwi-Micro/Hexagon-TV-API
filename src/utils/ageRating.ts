import { ResultSet } from "@libsql/client";
import { parseAgeRatings, ReturnData, type ageRating } from "./types";
import { runSQL } from "./database";

/**
 * This function gets all age ratings from the database.
 * @returns All the age ratings.
 */

export async function getAgeRatings(): Promise<ReturnData<ageRating[]>> {
	try {
		const dbResults: ResultSet = await runSQL(false, "SELECT * FROM ageRatings", false);

		return {
			status: "success",
			httpStatus: 200,
			analyticsEventType: "api.ageRatings.getAgeRatings",
			data: parseAgeRatings(dbResults),
		};
	} catch (error: any) {
		console.error("Error getting age ratings:", error);
		return {
			status: "server error",
			httpStatus: 500,
			analyticsEventType: "api.ageRatings.getAgeRatings.failed",
			data: null,
		};
	}
}

/**
 * This function gets the specified age rating from the database.
 * @param ageRating The age rating to get.
 * @returns All the age ratings.
 */

export async function getAgeRatingInfo(ageRating: string): Promise<ReturnData<string>> {
	try {
		const dbResults: ResultSet = await runSQL(
			false,
			"SELECT * FROM ageRatings WHERE ageRating = ?",
			true,
			[ageRating],
		);

		if (dbResults.rows.length === 0) {
			return {
				status: "age rating not found",
				httpStatus: 404,
				analyticsEventType: "api.ageRatings.getAgeRatingInfo.failed",
				data: null,
			};
		}

		return {
			status: "success",
			httpStatus: 200,
			analyticsEventType: "api.ageRatings.getAgeRatingInfo",
			data: dbResults.rows[0].ageRatingInfo as string,
		};
	} catch (error: any) {
		console.error("Error getting age rating info:", error);
		return {
			status: "server error",
			httpStatus: 500,
			analyticsEventType: "api.ageRatings.getAgeRatingInfo.failed",
			data: null,
		};
	}
}
