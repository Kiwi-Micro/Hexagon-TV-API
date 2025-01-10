import { Router } from "express";
import { getVideos } from "../../../utils/database";

const router = Router();

router.get("/tvshows", async (req, res) => {
	try {
		const results = await getVideos("tvshows");
		res.json(results);
	} catch (error) {
		console.error("Error fetching videos:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

export default router;
