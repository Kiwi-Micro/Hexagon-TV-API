import { Router } from "express";
//import { addVideo, auth } from "../../../utils/database";
import { printEndpointReached } from "../../../utils/messages";

const router = Router();

router.post("/add", async (req, res) => {
	printEndpointReached(req, res);
	/*if (await auth(req.body.sessionId, req.body.username, true)) {
		try {
			const status = await addVideo(req.body);
			if (status) {
				res.json({ status: "success" });
			} else {
				res.status(409).json({ status: "server error" });
			}
		} catch (error) {
			console.error("Error adding video:", error);
			res.status(500).json({ status: "server srror" });
		}
	} else {
		res.status(403).json({ status: "invalid credentials" });
	}*/
	res
		.status(403)
		.json({ status: "ADMIN ACCEESS CONTROL NOT IMPLEMENTED YET" });
});

export default router;
