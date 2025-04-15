import { Router } from "express";
import { adminAuth } from "../../../../utils/database";
import { deleteCategory } from "../../../../utils/category";
import { printEndpointReached } from "../../../../utils/messages";

const router = Router();

router.delete("/deleteCategory", async (req, res) => {
	if (await adminAuth(req.body.sessionId, req.body.userId)) {
		try {
			const status = await deleteCategory(req.body);
			if (status) {
				res.json({ status: "success" });
			} else {
				res.status(500).json({ status: "server error" });
			}
		} catch (error) {
			console.error("Error deleting category:", error);
			res.status(500).json({ status: "server srror" });
		}
	} else {
		res.status(403).json({ status: "invalid credentials" });
	}
	printEndpointReached(req, res);
});

export default router;
