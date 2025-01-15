import { Router } from "express";
import { getVideosForSearch } from "../../../utils/database";
import { printEndpointReached } from "../../../utils/messages";

const router = Router();

router.get("/search", async (req, res) => {
	printEndpointReached(req, res);
	try {
		const results = await getVideosForSearch(req.query.query as string);
		res.json(results);
	} catch (error) {
		console.error("Error fetching videos:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

export default router;
