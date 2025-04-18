import { Router } from "express";
import { addCategory } from "../../../../utils/category";
import { printEndpointReached } from "../../../../utils/messages";
import { getUserPermissions } from "../../../../utils/permissions";
import { checkPermissions } from "../../../../utils/database";

const router = Router();

router.post("/addCategory", async (req, res) => {
	if (
		await checkPermissions(
			req.body.userId,
			req.body.sessionId,
			true,
			(
				await getUserPermissions(req.body.userId)
			).canModifyCategories,
		)
	) {
		try {
			const status = await addCategory(req.body);
			if (status) {
				res.json({ status: "success" });
			} else {
				res.status(409).json({ status: "unable to add category" });
			}
		} catch (error) {
			console.error("Error adding category:", error);
			res.status(500).json({ status: "server srror" });
		}
	} else {
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
