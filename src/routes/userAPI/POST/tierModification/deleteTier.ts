import { Router } from "express";
import { checkPermissionsAndAuthenticate } from "../../../../utils/database";
import { deleteTier } from "../../../../utils/tiers";
import { printEndpointReached } from "../../../../utils/messages";
import { getUserPermissions } from "../../../../utils/permissions";

const router = Router();

router.delete("/deleteTier", async (req, res) => {
	if (
		await checkPermissionsAndAuthenticate(
			req.body.userId,
			req.body.sessionId,
			true,
			(
				await getUserPermissions(req.body.userId)
			).canModifyTiers,
		)
	) {
		try {
			const status = await deleteTier(req.body);
			if (status) {
				res.json({ status: "success" });
			} else {
				res.status(409).json({ status: "tier not found" });
			}
		} catch (error: any) {
			console.error("Error deleting tier:", error);
			res.status(500).json({ status: "server srror" });
		}
	} else {
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
