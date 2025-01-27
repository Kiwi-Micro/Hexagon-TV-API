import { Router } from "express";
import { addToWatchlist } from "../../../utils/watchlist";
import { auth } from "../../../utils/database";
import { printEndpointReached } from "../../../utils/messages";

const router = Router();

router.post("/addToWatchlist", async (req, res) => {
	printEndpointReached(req, res);
	if (await auth(req.body.sessionId, req.body.userId, req.body.username)) {
		try {
			const status = await addToWatchlist(req.body);
			if (status) {
				res.json({ status: "success" });
			} else {
				res.status(409).json({ status: "server error" });
			}
		} catch (error) {
			console.error("Error adding to watchlist:", error);
			res.status(500).json({ status: "server srror" });
		}
	} else {
		res.status(403).json({ status: "invalid credentials" });
	}
});

export default router;
