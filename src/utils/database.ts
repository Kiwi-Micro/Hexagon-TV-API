import { ResultSet } from "@libsql/client";
import { getDbConnection, clerkClient } from "./connections";

/**
 * This function checks if the user is authenticated.
 * @param sessionId The session ID of the user.
 * @param userId The user ID of the user.
 * @param username The username of the user.
 * @param usernameOverride Whether to allow the user to authenticate even if their username is not the same.
 * @returns True if the user is authenticated, false otherwise.
 */

async function auth(
	sessionId: string,
	userId: string,
	username: string,
	usernameOverride?: boolean,
) {
	try {
		const status = "active";
		const sessions = await clerkClient.sessions.getSessionList({
			userId,
			status,
		});

		if (sessions.totalCount === 0) {
			return false;
		}
		for (const session of sessions.data) {
			if (session.id === sessionId) {
				return true;
			}
		}

		const user = await clerkClient.users.getUser(userId);
		const registeredUsername = user.username;
		if (!usernameOverride) {
			if (registeredUsername !== username) {
				return false;
			}
		}
		return false;
	} catch (error: any) {
		if (error.status === 404) {
			return false;
		}
		console.error("Error authenticating:", error);
		return false;
	}
}

/**
 * This function checks if the user is an admin.
 * @param sessionId The session ID of the user.
 * @param userId The user ID of the user.
 * @returns True if the user is an admin, false otherwise.
 */

async function adminAuth(sessionId: string, userId: string) {
	try {
		const dbGetResults: ResultSet = await getDbConnection(true).execute({
			sql: "SELECT * FROM userPermissions WHERE isAdmin = 'true' AND userId = ?",
			args: [userId],
		});

		if (dbGetResults.rows.length === 0) {
			return false;
		}

		return auth(sessionId, userId, "", true);
	} catch (error: any) {
		if (error.status === 404) {
			return false;
		}
		console.error("Error authenticating:", error);
		return false;
	}
}

export { auth, adminAuth };
