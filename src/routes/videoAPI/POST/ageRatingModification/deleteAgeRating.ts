import { Router } from "express";
import { checkPermissionsAndAuthenticate } from "../../../../utils/database";
import { deleteAgeRating } from "../../../../utils/ageRating";
import { printEndpointReached } from "../../../../utils/messages";
import { getUserPermissions } from "../../../../utils/permissions";

const router = Router();

router.delete("/deleteAgeRating", async (req, res) => {
	if (
		await checkPermissionsAndAuthenticate(
			req.body.userId,
			req.body.sessionId,
			true,
			(
				await getUserPermissions(req.body.userId)
			).canModifyAgeRatings,
		)
	) {
		try {
			const status = await deleteAgeRating(req.body);
			if (status) {
				res.json({ status: "success" });
			} else {
				res.status(409).json({ status: "age rating not found" });
			}
		} catch (error) {
			console.error("Error deleting age rating:", error);
			res.status(500).json({ status: "server srror" });
		}
	} else {
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
