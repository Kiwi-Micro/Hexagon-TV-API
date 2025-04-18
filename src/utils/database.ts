import { clerkClient } from "./connections";
import { getUserPermissions } from "./permissions";

/**
 * This function checks if the user is authenticated.
 * @param sessionId The session ID of the user.
 * @param userId The user ID of the user.
 * @param username The username of the user.
 * @param usernameOverride Whether to allow the user to authenticate even if their username is not the same.
 * @returns True if the user is authenticated, false otherwise.
 */

async function auth(sessionId: string, userId: string) {
	try {
		const status = "active";
		const sessions = await clerkClient.sessions.getSessionList({
			userId,
			status,
		});

		if (sessions.totalCount === 0) {
			console.log("No sessions found");
			return false;
		}

		for (const session of sessions.data) {
			if (session.id === sessionId) {
				return true;
			}
		}
		console.log("No session found");
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
 * This function checks if the user is authenticated and has the correct permissions.
 * @param userId The user ID of the user.
 * @param sessionId The session ID of the user.
 * @param shouldCheckExtraPermissions Whether to check for extra permissions.
 * @param extraPermissions Extra permissions to check for.
 * @returns True if the user is authenticated and has the correct permissions, false otherwise.
 */

async function checkPermissionsAndAuthenticate(
	userId: string,
	sessionId: string,
	shouldCheckExtraPermissions: boolean,
	extraPermissions?: any,
) {
	if (
		((extraPermissions == "true" && shouldCheckExtraPermissions) ||
			(await getUserPermissions(userId)).isAdmin == "true") &&
		(await auth(sessionId, userId))
	) {
		return true;
	} else {
		return false;
	}
}

export { auth, checkPermissionsAndAuthenticate };
