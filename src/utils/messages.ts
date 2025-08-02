/**
 * Log that the endpoint was reached.
 * @param req The request object
 * @param res The response object
 */

import { getDateTime } from "./database";

export function printEndpointReached(req: any, res?: any) {
	console.log(
		`${req.socket.remoteAddress}: ${getDateTime()}: ${req.method} ${req.url} ${
			res ? res.statusCode : ""
		}`,
	);
}

/**
 * Log that an error occurred (If in development).
 * @param errorText
 */

export function printErrorMessage(errorText: string) {
	if (process.env.SHOW_ERROR_MESSAGES === "true") {
		if (process.env.NODE_ENV === "development") {
			console.log(`[ERROR] ${getDateTime()}: ${errorText}`);
		}
	}
}
