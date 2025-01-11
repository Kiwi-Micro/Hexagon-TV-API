import { Router } from "express";
import { getWatchlist } from "../../../utils/watchlist";

const router = Router();

router.get("/getWatchlist", async (req, res) => {
	try {
		const results = await getWatchlist(req.body.username);
		res.json(results);
	} catch (error) {
		console.error("Error fetching watchlist:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

export default router;
