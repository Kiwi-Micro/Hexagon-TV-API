import { ResultSet } from "@libsql/client";
import { parsePermissions, ReturnData, type Permission } from "./types";
import { runSQL } from "./database";
import { printErrorMessage } from "./messages";

/**
 * This function adds a user row to the database.
 * @param userId The user ID of the user.
 * @returns True if the user row was added, false otherwise.
 */

export async function addUserRow(userId: string): Promise<ReturnData<null>> {
	try {
		const dbResults: ResultSet = await runSQL(
			true,
			"INSERT INTO userPermissions (userId, isAdmin, canModifyPermissions, canModifyVideos, canModifyCategories, canModifyTVShows, canModifyAgeRatings) VALUES (?, 0, 0, 0, 0, 0, 0) ON CONFLICT (userId) DO NOTHING;",
			true,
			[userId],
		);
		return dbResults.rowsAffected > 0
			? {
					status: "success",
					httpStatus: 200,
					analyticsEventType: "api.permissions.addUserRow",
					data: null,
			  }
			: {
					status: "server error",
					httpStatus: 500,
					analyticsEventType: "api.permissions.addUserRow.failed",
					data: null,
			  };
	} catch (error: any) {
		printErrorMessage(`Error adding user row: ${error}`);
		return {
			status: "server error",
			httpStatus: 500,
			analyticsEventType: "api.permissions.addUserRow.failed",
			data: null,
		};
	}
}

/**
 * This function updates a user's permissions in the database.
 * TODO: REWIRE THIS FUNCTION TO IMPROVE TYPE SAFETY.
 * WARN: This function's return type's and data will change in the future.
 * @param data The data to update the user's permissions.
 * @returns True if the user's permissions were updated, false otherwise.
 */

export async function updateUserPermissions(data: Permission): Promise<ReturnData<null>> {
	try {
		await addUserRow(data.userId);
		const dbGetResults = (await getUserPermissions(data.userId)).data;

		const fields = [
			"isAdmin",
			"canModifyPermissions",
			"canModifyItems",
			"canModifyCategories",
			"canModifyAgeRatings",
		] as const;

		if (dbGetResults == null) {
			return {
				status: "user not found",
				httpStatus: 404,
				analyticsEventType: "api.permissions.updateUserPermissions.failed",
				data: null,
			};
		}

		const inputs = Object.fromEntries(
			fields.map((field) => [field, data[field] ?? dbGetResults![field]]),
		);
		const dbResults: ResultSet = await runSQL(
			true,
			"UPDATE userPermissions SET isAdmin = ?, canModifyPermissions = ?, canModifyItems = ?, canModifyCategories = ?, canModifyAgeRatings = ? WHERE userId = ?;",
			true,
			[
				inputs.isAdmin,
				inputs.canModifyPermissions,
				inputs.canModifyItems,
				inputs.canModifyCategories,
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
		printErrorMessage(`Error updating user permissions: ${error}`);
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

export async function getUserPermissions(
	userId: string,
): Promise<ReturnData<Permission>> {
	try {
		const dbResults: ResultSet = await runSQL(
			false,
			"SELECT * FROM userPermissions WHERE userId = ?",
			true,
			[userId],
		);

		if (dbResults.rows.length === 0) {
			return {
				status: "user not found",
				httpStatus: 404,
				analyticsEventType: "api.permissions.getUserPermissions.failed",
				data: null,
			};
		}

		return {
			status: "success",
			httpStatus: 200,
			analyticsEventType: "api.permissions.getUserPermissions",
			data: parsePermissions(dbResults)[0],
		};
	} catch (error: any) {
		printErrorMessage(`Error getting user permissions: ${error}`);
		return {
			status: "server error",
			httpStatus: 500,
			analyticsEventType: "api.permissions.getUserPermissions.failed",
			data: null,
		};
	}
}
