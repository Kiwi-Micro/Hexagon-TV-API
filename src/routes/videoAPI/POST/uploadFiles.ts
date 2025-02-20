import { createUploadthing, type FileRouter, UploadThingError } from "uploadthing/server";
import { printEndpointReached } from "../../../utils/messages";
import { adminAuth } from "../../../utils/database";

const f = createUploadthing();

const uploadRouter = {
	video: f(
		{
			video: {
				maxFileSize: "16MB",
				maxFileCount: 1,
			},
		},
		{
			awaitServerData: true,
		},
	)
		.middleware(async ({ req, res }) => {
			printEndpointReached(req, res);
			const user = await adminAuth(
				(req.headers as any).sessionid,
				(req.headers as any).userid,
			);

			if (!user) throw new UploadThingError("Unauthorized");

			return {};
		})
		.onUploadComplete(async () => {
			return { status: "success" };
		}),
	thumbnail: f(
		{
			image: {
				maxFileSize: "4MB",
				maxFileCount: 1,
			},
		},
		{
			awaitServerData: true,
		},
	)
		.middleware(async ({ req, res }) => {
			printEndpointReached(req, res);
			const user = await adminAuth(
				(req.headers as any).sessionid,
				(req.headers as any).userid,
			);

			if (!user) throw new UploadThingError("Unauthorized");

			return {};
		})
		.onUploadComplete(async () => {
			return { status: "success" };
		}),
} satisfies FileRouter;

export default uploadRouter;
export type OurFileRouter = typeof uploadRouter;
