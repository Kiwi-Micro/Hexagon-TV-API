import { Router } from "express";
import { printEndpointReached } from "../../../../utils/messages";
import { auth } from "../../../../utils/database";
import { updateUserVideoProgress } from "../../../../utils/videoProgress";

const router = Router();

router.post("/updateUserVideoProgress", async (req, res) => {
	if (await auth(req.body.sessionId, req.body.userId)) {
		try {
			const status = await updateUserVideoProgress(req.body);
			if (status) {
				res.json({ status: "success" });
			} else {
				res.status(409).json({ status: "user not found" });
			}
		} catch (error: any) {
			console.error("Error updating user progress:", error);
			res.status(500).json({ status: "server srror" });
		}
	} else {
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
