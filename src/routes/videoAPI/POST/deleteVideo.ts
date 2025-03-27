import { Router } from "express";
import { deleteVideo, adminAuth } from "../../../utils/database";
import { printEndpointReached } from "../../../utils/messages";

const router = Router();

router.delete("/delete", async (req, res) => {
	if (await adminAuth(req.body.sessionId, req.body.userId)) {
		try {
			const status = await deleteVideo(req.body);
			if (status) {
				res.json({ status: "success" });
			} else {
				res.status(500).json({ status: "server error" });
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
