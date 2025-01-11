import { Router } from "express";
import { deleteFromWatchlist } from "../../../utils/watchlist";
import { auth } from "../../../utils/database";

const router = Router();

router.delete("/deleteFromWatchlist", async (req, res) => {
	if (await auth(req.body.sessionId, req.body.username, false)) {
		try {
			const status = await deleteFromWatchlist(req.body);
			if (status) {
				res.json({ status: "success" });
			} else {
				res.status(409).json({ status: "server error" });
			}
		} catch (error) {
			console.error("Error removing from watchlist:", error);
			res.status(500).json({ error: "server srror" });
		}
	} else {
		res.status(403).json({ status: "invalid credentials" });
	}
});

export default router;
