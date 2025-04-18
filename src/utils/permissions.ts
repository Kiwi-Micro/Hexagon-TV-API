import { ResultSet } from "@libsql/client";
import { getDbConnection } from "./connections";
import type { Permission } from "./types";

/**
 * This function adds a user row to the database.
 * @param userId The user ID of the user.
 * @returns True if the user row was added, false otherwise.
 */

async function addUserRow(userId: string) {
	const dbResults: ResultSet = await getDbConnection(true).execute({
		sql: "INSERT INTO userPermissions (userId, isAdmin, canModifyPermissions, canModifyVideos, canModifyCategorys, canModifyTVShows, canModifyAgeRating) VALUES (?, 'false', 'false', 'false', 'false', 'false', 'false') ON CONFLICT (userId) DO NOTHING;",
		args: [userId],
	});
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
		"canModifyAgeRating",
	] as const;

	const inputs = Object.fromEntries(
		fields.map((field) => [field, data[field] ?? dbGetResults[field]]),
	);

	const dbResults: ResultSet = await getDbConnection(true).execute({
		sql: "UPDATE userPermissions SET userId = ?, isAdmin = ?, canModifyPermissions = ?, canModifyVideos = ?, canModifyCategorys = ?, canModifyTVShows = ?, canModifyAgeRating = ? WHERE id = ?;",
		args: [
			data.userId,
			inputs.isAdmin,
			inputs.canModifyPermissions,
			inputs.canModifyVideos,
			inputs.canModifyCategorys,
			inputs.canModifyTVShows,
			inputs.canModifyAgeRating,
			data.id,
		],
	});
	return dbResults.rowsAffected > 0;
}

/**
 * This function gets the user permissions from the database.
 * @param userId The user ID of the user.
 * @returns The given user's permissions.
 */

async function getUserPermissions(userId: string) {
	const dbGetResults: ResultSet = await getDbConnection(false).execute({
		sql: "SELECT * FROM userPermissions WHERE userId = ?",
		args: [userId],
	});
	return dbGetResults.rows[0];
}

export { addUserRow, updateUserPermissions, getUserPermissions };
