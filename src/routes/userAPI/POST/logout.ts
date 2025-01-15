import { Router } from "express";
import { ResultSet } from "@libsql/client";
import { auth } from "../../../utils/database";
import { getDbConnection } from "../../../utils/databaseConnection";
import { printEndpointReached } from "../../../utils/messages";

const router = Router();

async function logoutUser(data: any) {
	try {
		if (data.all === "true") {
			const dbResults: ResultSet = await getDbConnection(false).execute({
				sql: "DELETE FROM sessions WHERE username = ?",
				args: [data.username],
			});
			return dbResults.rowsAffected > 0;
		} else {
			const dbResults: ResultSet = await getDbConnection(false).execute({
				sql: "DELETE FROM sessions WHERE sessionId = ? AND username = ?",
				args: [data.sessionId, data.username],
			});
			return dbResults.rowsAffected > 0;
		}
	} catch (error) {
		console.error("Error deleting session ID:", error);
		return false;
	}
}

router.delete("/logout", async (req, res) => {
	printEndpointReached(req, res);
	if (await auth(req.body.sessionId, req.body.username, false)) {
		try {
			const status = await logoutUser(req.body);
			if (status) {
				res.json({ status: "success" });
			} else {
				res.status(409).json({ status: "server error" });
			}
		} catch (error) {
			console.error("Error deleting session ID:", error);
			res.status(500).json({ error: "server srror" });
		}
	} else {
		res.status(403).json({ status: "invalid credentials" });
	}
});

export default router;
