import { Router } from "express";
import { getVideos } from "../../../utils/database";
import { printEndpointReached } from "../../../utils/messages";

const router = Router();

router.get("/getVideoData", async (req, res) => {
	printEndpointReached(req, res);
	try {
		const results = await getVideos();
		res.json(results);
	} catch (error) {
		console.error("Error fetching videos:", error);
		res.status(500).json({ status: "server error" });
	}
});

export default router;
