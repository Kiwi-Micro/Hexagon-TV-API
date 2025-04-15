import { Router } from "express";
import { adminAuth } from "../../../../utils/database";
import { deleteVideo } from "../../../../utils/video";
import { printEndpointReached } from "../../../../utils/messages";

const router = Router();

router.delete("/deleteVideo", async (req, res) => {
	if (await adminAuth(req.body.sessionId, req.body.userId)) {
		try {
			const status = await deleteVideo(req.body);
			if (status) {
				res.json({ status: "success" });
			} else {
				res.status(409).json({ status: "video not found" });
			}
		} catch (error) {
			console.error("Error deleting video:", error);
			res.status(500).json({ status: "server srror" });
		}
	} else {
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
