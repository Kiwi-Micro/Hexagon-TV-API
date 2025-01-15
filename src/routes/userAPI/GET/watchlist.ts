import { Router } from "express";
import { getWatchlist } from "../../../utils/watchlist";
import { printEndpointReached } from "../../../utils/messages";

const router = Router();

router.get("/getWatchlist", async (req, res) => {
	printEndpointReached(req, res);
	try {
		const results = await getWatchlist(req.query.username as string);
		res.json(results);
	} catch (error) {
		console.error("Error fetching watchlist:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

export default router;
