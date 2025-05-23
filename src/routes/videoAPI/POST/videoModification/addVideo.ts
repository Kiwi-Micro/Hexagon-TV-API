import { Router } from "express";
import { checkPermissionsAndAuthenticate } from "../../../../utils/database";
import { getUserPermissions } from "../../../../utils/permissions";
import { addVideo } from "../../../../utils/video";
import { printEndpointReached } from "../../../../utils/messages";

const router = Router();

router.post("/addVideo", async (req, res) => {
	if (
		await checkPermissionsAndAuthenticate(
			req.body.userId,
			req.body.sessionId,
			true,
			(
				await getUserPermissions(req.body.userId)
			).canModifyVideos,
		)
	) {
		try {
			const status = await addVideo(req.body);
			if (status) {
				res.json({ status: "success" });
			} else {
				res.status(409).json({ status: "unable to add video" });
			}
		} catch (error: any) {
			console.error("Error adding video:", error);
			res.status(500).json({ status: "server srror" });
		}
	} else {
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
