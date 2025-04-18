import { Router } from "express";
import { checkPermissions } from "../../../../utils/database";
import { getUserPermissions } from "../../../../utils/permissions";
import { updateUserPermissions } from "../../../../utils/permissions";
import { printEndpointReached } from "../../../../utils/messages";

const router = Router();

router.post("/updateUserPermissions", async (req, res) => {
	if (
		await checkPermissions(
			req.body.userId,
			req.body.sessionId,
			true,
			(
				await getUserPermissions(req.body.userId)
			).canModifyPermissions,
		)
	) {
		try {
			const status = await updateUserPermissions(req.body);
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
	printEndpointReached(req, res);
});

export default router;
