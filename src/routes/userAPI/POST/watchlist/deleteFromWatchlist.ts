import { Router } from "express";
import { deleteFromWatchlist } from "../../../../utils/watchlist";
import { auth } from "../../../../utils/database";
import { printEndpointReached } from "../../../../utils/messages";

const router = Router();

router.delete("/deleteFromWatchlist", async (req, res) => {
	if (await auth(req.body.sessionId, req.body.userId)) {
		try {
			const status = await deleteFromWatchlist(req.body);
			if (status) {
				res.json({ status: "success" });
			} else {
				res.status(409).json({ status: "watchlist item not found" });
			}
		} catch (error: any) {
			console.error("Error removing from watchlist:", error);
			res.status(500).json({ status: "server srror" });
		}
	} else {
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
