import { ResultSet } from "@libsql/client";
import type { Permission } from "./types";
import { runSQL } from "./database";

/**
 * This function adds a user row to the database.
 * @param userId The user ID of the user.
 * @returns True if the user row was added, false otherwise.
 */

async function addUserRow(userId: string) {
	const dbResults: ResultSet = await runSQL(
		true,
		"INSERT INTO userPermissions (userId, isAdmin, canModifyPermissions, canModifyVideos, canModifyCategorys, canModifyTVShows, canModifyAgeRatings, canModifyTiers) VALUES (?, 'false', 'false', 'false', 'false', 'false', 'false', 'false') ON CONFLICT (userId) DO NOTHING;",
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

async function updateUserPermissions(data: Permission) {
	await addUserRow(data.userId);
	const dbGetResults = await getUserPermissions(data.userId);

	const fields = [
		"isAdmin",
		"canModifyPermissions",
		"canModifyVideos",
		"canModifyCategorys",
		"canModifyTVShows",
		"canModifyAgeRatings",
		"canModifyTiers",
	] as const;

	const inputs = Object.fromEntries(
		fields.map((field) => [field, data[field] ?? dbGetResults[field]]),
	);
	const dbResults: ResultSet = await runSQL(
		true,
		"UPDATE userPermissions SET isAdmin = ?, canModifyPermissions = ?, canModifyVideos = ?, canModifyCategorys = ?, canModifyTVShows = ?, canModifyAgeRatings = ?, canModifyTiers = ? WHERE userId = ?;",
		true,
		[
			inputs.isAdmin,
			inputs.canModifyPermissions,
			inputs.canModifyVideos,
			inputs.canModifyCategorys,
			inputs.canModifyTVShows,
			inputs.canModifyAgeRatings,
			inputs.canModifyTiers,
			data.userId,
		],
	);
	console.log(dbResults);
	return dbResults.rowsAffected > 0;
}

/**
 * This function gets the user permissions from the database.
 * @param userId The user ID of the user.
 * @returns The given user's permissions.
 */

async function getUserPermissions(userId: string) {
	const dbResults: ResultSet = await runSQL(
		false,
		"SELECT * FROM userPermissions WHERE userId = ?",
		true,
		[userId],
	);
	return dbResults.rows[0];
}

export { addUserRow, updateUserPermissions, getUserPermissions };
