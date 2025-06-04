import { ResultSet } from "@libsql/client/.";
import { clerkClient, getDbConnection } from "./connections";
import { getUserPermissions } from "./permissions";
import { PostHog } from "posthog-node";
import config from "../../config.json";

/**
 * This function runs a SQL query.
 * NOTE: If you are changing SQL Providers change it here! This is the only place you need to change.
 * @param needsRW If the query needs Read Write access.
 * @param sql The SQL query to run.
 * @param hasArgs Whether the query has arguments.
 * @param args The arguments to pass to the SQL query.
 * @returns The results of the SQL query.
 */

async function runSQL(
	needsRW: boolean,
	sql: string,
	hasArgs: boolean,
	args?: any,
): Promise<ResultSet> {
	if (hasArgs && args) {
		const dbResults: ResultSet = await getDbConnection(needsRW).execute({
			sql,
			args,
		});
		return dbResults;
	} else {
		const dbResults: ResultSet = await getDbConnection(needsRW).execute(sql);
		return dbResults;
	}
}

/**
 * This function checks if the user is authenticated.
 * NOTE: If you are changing Auth Providers change it here! Also change the `checkPermissionsAndAuthenticate()` function.
 * @param sessionId The session ID of the user.
 * @param userId The user ID of the user.
 * @param username The username of the user.
 * @param usernameOverride Whether to allow the user to authenticate even if their username is not the same.
 * @returns True if the user is authenticated, false otherwise.
 */

async function auth(sessionId: string, userId: string): Promise<boolean> {
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
 * NOTE: If you are changing Auth Providers change it here! Also change the `auth()` function.
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
): Promise<boolean> {
	if (
		((extraPermissions == true && shouldCheckExtraPermissions) ||
			(await getUserPermissions(userId)).isAdmin == true) &&
		(await auth(sessionId, userId))
	) {
		return true;
	} else {
		return false;
	}
}

const posthogKey = config[0]["POSTHOG_KEY"] || "";

/**
 * The PostHog client.
 */

const client = new PostHog(posthogKey, {
	host: "https://us.i.posthog.com",
});

/**
 * This function sends an analytics event to PostHog.
 * @param userId
 * @param event
 * @param properties
 */

function sendAnalyticsEvent(userId: string, event: string, properties?: any): void {
	client.capture({
		distinctId: userId || "user_noId",
		event: event,
		properties: properties,
	});

	client.flush();
}

export { auth, checkPermissionsAndAuthenticate, runSQL, sendAnalyticsEvent };
