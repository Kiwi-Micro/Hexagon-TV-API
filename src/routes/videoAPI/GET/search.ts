import { Router } from "express";
import { getVideosForSearch } from "../../../utils/video";
import { printEndpointReached } from "../../../utils/messages";

const router = Router();

router.get("/search", async (req, res) => {
	try {
		res.json(
			await getVideosForSearch(req.query.query as string, req.query.userId as string),
		);
	} catch (error: any) {
		console.error("Error fetching videos:", error);
		res.status(500).json({ status: "server error" });
	}
	printEndpointReached(req, res);
});

export default router;
