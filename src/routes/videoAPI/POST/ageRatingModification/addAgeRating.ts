import { Router } from "express";
import { addAgeRating } from "../../../../utils/ageRating";
import { printEndpointReached } from "../../../../utils/messages";
import { getUserPermissions } from "../../../../utils/permissions";
import { checkPermissionsAndAuthenticate } from "../../../../utils/database";

const router = Router();

router.post("/addAgeRating", async (req, res) => {
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
			const status = await addAgeRating(req.body);
			if (status) {
				res.json({ status: "success" });
			} else {
				res.status(409).json({ status: "unable to add age rating" });
			}
		} catch (error) {
			console.error("Error adding age rating:", error);
			res.status(500).json({ status: "server srror" });
		}
	} else {
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
