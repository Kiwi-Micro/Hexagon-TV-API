import { createUploadthing, type FileRouter, UploadThingError } from "uploadthing/server";
import { printEndpointReached } from "../../../../utils/messages";
import { checkPermissions } from "../../../../utils/database";
import { getUserPermissions } from "../../../../utils/permissions";

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
		.middleware(async ({ req }) => {
			printEndpointReached(req);

			if (
				await checkPermissions(
					(req.headers as any).userId,
					(req.headers as any).sessionId,
					true,
					(
						await getUserPermissions((req.headers as any).userId)
					).canModifyVideos,
				)
			) {
				return {};
			} else {
				throw new UploadThingError("Unauthorized");
			}
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
		.middleware(async ({ req }) => {
			printEndpointReached(req);

			if (
				await checkPermissions(
					(req.headers as any).userId,
					(req.headers as any).sessionId,
					true,
					(
						await getUserPermissions((req.headers as any).userId)
					).canModifyVideos,
				)
			) {
				return {};
			} else {
				throw new UploadThingError("Unauthorized");
			}
		})
		.onUploadComplete(async () => {
			return { status: "success" };
		}),
} satisfies FileRouter;

export default uploadRouter;
export type OurFileRouter = typeof uploadRouter;
