import { Router } from "express";
import { getVideos } from "../../../utils/video";
import { printEndpointReached } from "../../../utils/messages";

const router = Router();

router.get("/getVideos", async (req, res) => {
	try {
		res.json(await getVideos(req.query.userId as string));
	} catch (error: any) {
		console.error("Error fetching videos:", error);
		res.status(500).json({ status: "server error" });
	}
	printEndpointReached(req, res);
});

export default router;
