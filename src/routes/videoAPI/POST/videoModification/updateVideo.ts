import { Router } from "express";
import { adminAuth, getUserPermissions } from "../../../../utils/database";
import { updateVideo } from "../../../../utils/video";
import { printEndpointReached } from "../../../../utils/messages";

const router = Router();

router.post("/updateVideo", async (req, res) => {
	if (await adminAuth(req.body.sessionId, req.body.userId)) {
		if (
			(await getUserPermissions(req.body.userId, "canAddVideos")).canAddVideos == "true"
		) {
			try {
				const status = await updateVideo(req.body);
				if (status) {
					res.json({ status: "success" });
				} else {
					res.status(409).json({ status: "video not found" });
				}
			} catch (error) {
				console.error("Error adding video:", error);
				res.status(500).json({ status: "server srror" });
			}
		} else {
			res.status(403).json({ status: "invalid credentials" });
		}
	} else {
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
