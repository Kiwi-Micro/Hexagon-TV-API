import { Router } from "express";
import { printEndpointReached } from "../../../utils/messages";
import { getUserVideoProgress } from "../../../utils/videoProgress";

const router = Router();

router.get("/getUserVideoProgress", async (req, res) => {
	try {
		const results = await getUserVideoProgress(
			req.query.userId as string,
			req.query.videoId as string,
		);
		res.json(results);
	} catch (error: any) {
		console.error("Error fetching permissions:", error);
		res.status(500).json({ status: "server error" });
	}
	printEndpointReached(req, res);
});

export default router;
