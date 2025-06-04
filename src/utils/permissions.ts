import { ResultSet } from "@libsql/client";
import { parsePermissions, ReturnData, type Permission } from "./types";
import { runSQL } from "./database";

/**
 * This function adds a user row to the database.
 * @param userId The user ID of the user.
 * @returns True if the user row was added, false otherwise.
 */

export async function addUserRow(userId: string): Promise<boolean> {
	const dbResults: ResultSet = await runSQL(
		true,
		"INSERT INTO userPermissions (userId, isAdmin, canModifyPermissions, canModifyVideos, canModifyCategories, canModifyTVShows, canModifyAgeRatings) VALUES (?, 0, 0, 0, 0, 0, 0) ON CONFLICT (userId) DO NOTHING;",
		true,
		[userId],
	);
	return dbResults.rowsAffected > 0;
}

/**
 * This function updates a user's permissions in the database.
 * @param data The data to update the user's permissions.
 * @returns True if the user's permissions were updated, false otherwise.
 */

export async function updateUserPermissions(data: Permission): Promise<ReturnData> {
	try {
		await addUserRow(data.userId);
		const dbGetResults = await getUserPermissions(data.userId);

		const fields = [
			"isAdmin",
			"canModifyPermissions",
			"canModifyVideos",
			"canModifyCategories",
			"canModifyTVShows",
			"canModifyAgeRatings",
		] as const;

		const inputs = Object.fromEntries(
			fields.map((field) => [field, data[field] ?? dbGetResults[field]]),
		);
		const dbResults: ResultSet = await runSQL(
			true,
			"UPDATE userPermissions SET isAdmin = ?, canModifyPermissions = ?, canModifyVideos = ?, canModifyCategories = ?, canModifyTVShows = ?, canModifyAgeRatings = ? WHERE userId = ?;",
			true,
			[
				inputs.isAdmin,
				inputs.canModifyPermissions,
				inputs.canModifyVideos,
				inputs.canModifyCategories,
				inputs.canModifyTVShows,
				inputs.canModifyAgeRatings,
				data.userId,
			],
		);
		return dbResults.rowsAffected > 0
			? {
					status: "success",
					httpStatus: 200,
					analyticsEventType: "api.permissions.updateUserPermissions",
					data: null,
			  }
			: {
					status: "server error",
					httpStatus: 500,
					analyticsEventType: "api.permissions.updateUserPermissions.failed",
					data: null,
			  };
	} catch (error: any) {
		console.error("Error updating user permissions:", error);
		return {
			status: "server error",
			httpStatus: 500,
			analyticsEventType: "api.permissions.updateUserPermissions.failed",
			data: null,
		};
	}
}

/**
 * This function gets the user permissions from the database.
 * @param userId The user ID of the user.
 * @returns The given user's permissions.
 */

export async function getUserPermissions(userId: string): Promise<Permission> {
	const dbResults: ResultSet = await runSQL(
		false,
		"SELECT * FROM userPermissions WHERE userId = ?",
		true,
		[userId],
	);
	return parsePermissions(dbResults)[0];
}
