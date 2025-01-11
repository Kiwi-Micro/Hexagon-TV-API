import { Router } from "express";
import { addToWatchlist, auth } from "../../../utils/watchlist";

const router = Router();

router.post("/addToWatchlist", async (req, res) => {
	if (await auth(req.body.sessionId, req.body.username)) {
		try {
			const status = await addToWatchlist(req.body);
			if (status) {
				res.json({ status: "success" });
			} else {
				res.status(409).json({ status: "server error" });
			}
		} catch (error) {
			console.error("Error adding to watchlist:", error);
			res.status(500).json({ error: "server srror" });
		}
	} else {
		res.status(403).json({ status: "invalid credentials" });
	}
	//res.status(403).json({ status: "ACCESS CONTROL NOT DONE" });
});

export default router;
