import { Router } from "express";
import { adminAuth } from "../../../../utils/database";
import { addCategory } from "../../../../utils/category";
import { printEndpointReached } from "../../../../utils/messages";

const router = Router();

router.post("/addCategory", async (req, res) => {
	if (await adminAuth(req.body.sessionId, req.body.userId)) {
		try {
			const status = await addCategory(req.body);
			if (status) {
				res.json({ status: "success" });
			} else {
				res.status(409).json({ status: "server error" });
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
