import { Router } from "express";
//import { deleteVideo } from "../../../utils/database";

const router = Router();

/*
To Implemant:
def auth(sessionId, username):
	connection = getDbConnection()
	cursor = connection.cursor()

	try:
		query = """
		SELECT isAdmin FROM users
		WHERE username = %s
		"""
		cursor.execute(query, (username,))
		isAdmin = cursor.fetchall()
		if len(isAdmin) > 0 and isAdmin[0] == (1,):
			query = """
			SELECT sessionId FROM sessions
			WHERE sessionId = %s AND username = %s
			"""
			cursor.execute(query, (sessionId, username))
			results = cursor.fetchall()
			cleanUp(cursor, connection)
			if results:
				return True
			else:
				return False
		else:
			cleanUp(cursor, connection)
			return False
	except Exception as e:
		cleanUp(cursor, connection)
		raise RuntimeError(f"Error checking auth: {e}")
		return False
*/

router.delete("/delete", async (req, res) => {
	/*try {
		const status = await deleteVideo(req.body);
		if (status) {
			res.json({ status: "success" });
		} else {
			res.status(409).json({ status: "server error" });
		}
	} catch (error) {
		console.error("Error deleting video:", error);
		res.status(500).json({ error: "server srror" });
	}*/
	res.status(403).json({ status: "ACCESS CONTROL NOT DONE" });
});

export default router;
