import { Router } from "express";
import { updateCategory } from "../../../../utils/category";
import { printEndpointReached } from "../../../../utils/messages";
import { checkPermissionsAndAuthenticate } from "../../../../utils/database";
import { getUserPermissions } from "../../../../utils/permissions";

const router = Router();

router.post("/updateCategory", async (req, res) => {
	if (
		await checkPermissionsAndAuthenticate(
			req.body.userId,
			req.body.sessionId,
			true,
			(
				await getUserPermissions(req.body.userId)
			).canModifyCategories,
		)
	) {
		try {
			const status = await updateCategory(req.body);
			if (status) {
				res.json({ status: "success" });
			} else {
				res.status(409).json({ status: "category not found" });
			}
		} catch (error: any) {
			console.error("Error adding category:", error);
			res.status(500).json({ status: "server srror" });
		}
	} else {
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
