import { Router } from "express";
import { getWatchlist } from "../../../utils/watchlist";
import { printEndpointReached } from "../../../utils/messages";

const router = Router();

router.get("/getWatchlist", async (req, res) => {
	try {
		const results = await getWatchlist(req.query.username as string);
		res.json(results);
	} catch (error) {
		console.error("Error fetching watchlist:", error);
		res.status(500).json({ status: "server error" });
	}
	printEndpointReached(req, res);
});

export default router;
