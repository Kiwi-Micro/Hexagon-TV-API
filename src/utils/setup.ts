import getWatchlistEndpoint from "../routes/userAPI/GET/watchlist";
import getUserPermissionsEndpoint from "../routes/userAPI/GET/getUserPermissions";
import addToWatchlistEndpoint from "../routes/userAPI/POST/watchlist/addToWatchlist";
import deleteFromWatchlistEndpoint from "../routes/userAPI/POST/watchlist/deleteFromWatchlist";
import getCategoriesEndpoint from "../routes/videoAPI/GET/getCategories";
import categoryAddEndpoint from "../routes/videoAPI/POST/categoryModification/addCategory";
import categoryUpdateEndpoint from "../routes/videoAPI/POST/categoryModification/updateCategory";
import categoryDeleteEndpoint from "../routes/videoAPI/POST/categoryModification/deleteCategory";
import getAgeRatingsEndpoint from "../routes/videoAPI/GET/getAgeRatings";
import getVideosEndpoint from "../routes/videoAPI/GET/getVideos";
import searchEndpoint from "../routes/videoAPI/GET/search";
import videoDeleteEndpoint from "../routes/videoAPI/POST/videoModification/deleteVideo";
import videoAddEndpoint from "../routes/videoAPI/POST/videoModification/addVideo";
import videoUpdateEndpoint from "../routes/videoAPI/POST/videoModification/updateVideo";
import uploadFilesEndpoint from "../routes/videoAPI/POST/videoModification/uploadFiles";
import updateUserPermissionsEndpoint from "../routes/userAPI/POST/permissionModification/updateUserPermissions";
import updateUserVideoProgressEndpoint from "../routes/userAPI/POST/videoProgressModification/updateUserVideoProgress";
import getUserVideoProgressEndpoint from "../routes/userAPI/GET/getUserVideoProgress";
import { createRouteHandler } from "uploadthing/express";
import config from "../../config.json";

function createEndpoints(app: any) {
	const endpoints = [
		{
			path: "/videoAPI/ageRatings",
			handler: getAgeRatingsEndpoint,
		},
		{
			path: "/videoAPI/categories",
			handler: getCategoriesEndpoint,
		},
		{
			path: "/videoAPI/videos",
			handler: getVideosEndpoint,
		},
		{
			path: "/videoAPI/videos",
			handler: searchEndpoint,
		},
		{
			path: "/api/uploadthing",
			handler: createRouteHandler({
				router: uploadFilesEndpoint,
				config: {
					token: config[0]["UPLOADTHING_TOKEN"],
					logLevel: "Error",
				},
			}),
		},
		{
			path: "/videoAPI/videos",
			handler: videoDeleteEndpoint,
		},
		{
			path: "/videoAPI/videos",
			handler: videoAddEndpoint,
		},
		{
			path: "/videoAPI/videos",
			handler: videoUpdateEndpoint,
		},
		{
			path: "/videoAPI/categories",
			handler: categoryAddEndpoint,
		},
		{
			path: "/videoAPI/categories",
			handler: categoryUpdateEndpoint,
		},
		{
			path: "/videoAPI/categories",
			handler: categoryDeleteEndpoint,
		},
		{
			path: "/userAPI/permissions",
			handler: getUserPermissionsEndpoint,
		},
		{
			path: "/userAPI/watchlist",
			handler: getWatchlistEndpoint,
		},
		{
			path: "/userAPI/permissions",
			handler: updateUserPermissionsEndpoint,
		},
		{
			path: "/userAPI/watchlist",
			handler: addToWatchlistEndpoint,
		},
		{
			path: "/userAPI/watchlist",
			handler: deleteFromWatchlistEndpoint,
		},
		{
			path: "/userAPI/videoProgress",
			handler: getUserVideoProgressEndpoint,
		},
		{
			path: "/userAPI/videoProgress",
			handler: updateUserVideoProgressEndpoint,
		},
	];

	for (const endpoint of endpoints) {
		app.use(endpoint.path, endpoint.handler);
	}
}

export { createEndpoints };
