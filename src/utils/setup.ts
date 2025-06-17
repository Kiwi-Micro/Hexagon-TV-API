import getWatchlistEndpoint from "../routes/READ/watchlist";
import getUserPermissionsEndpoint from "../routes/READ/getUserPermissions";
import addToWatchlistEndpoint from "../routes/WRITE/watchlists/addToWatchlist";
import deleteFromWatchlistEndpoint from "../routes/WRITE/watchlists/deleteFromWatchlist";
import getCategoriesEndpoint from "../routes/READ/getCategories";
import categoryAddEndpoint from "../routes/WRITE/categories/addCategory";
import categoryUpdateEndpoint from "../routes/WRITE/categories/updateCategory";
import categoryDeleteEndpoint from "../routes/WRITE/categories/deleteCategory";
import getAgeRatingsEndpoint from "../routes/READ/getAgeRatings";
import getVideosEndpoint from "../routes/READ/getVideos";
import searchEndpoint from "../routes/READ/search";
import videoDeleteEndpoint from "../routes/WRITE/videos/deleteVideo";
import videoAddEndpoint from "../routes/WRITE/videos/addVideo";
import videoUpdateEndpoint from "../routes/WRITE/videos/updateVideo";
import uploadFilesEndpoint from "../routes/WRITE/uploadFiles";
import updateUserPermissionsEndpoint from "../routes/WRITE/permissions/updateUserPermissions";
import updateUserVideoProgressEndpoint from "../routes/WRITE/videoProgress/updateUserVideoProgress";
import getUserVideoProgressEndpoint from "../routes/READ/getUserVideoProgress";
import getTVShowsEndpoint from "../routes/READ/getTVShows";
import { createRouteHandler } from "uploadthing/express";
import config from "../../config.json";

export function createEndpoints(app: any) {
	const endpoints = [
		{
			path: "/ageRatings",
			handler: getAgeRatingsEndpoint,
		},
		{
			path: "/categories",
			handler: getCategoriesEndpoint,
		},
		{
			path: "/videos",
			handler: getVideosEndpoint,
		},
		{
			path: "",
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
			path: "/videos",
			handler: videoDeleteEndpoint,
		},
		{
			path: "/videos",
			handler: videoAddEndpoint,
		},
		{
			path: "/videos",
			handler: videoUpdateEndpoint,
		},
		{
			path: "/categories",
			handler: categoryAddEndpoint,
		},
		{
			path: "/categories",
			handler: categoryUpdateEndpoint,
		},
		{
			path: "/categories",
			handler: categoryDeleteEndpoint,
		},
		{
			path: "/permissions",
			handler: getUserPermissionsEndpoint,
		},
		{
			path: "/watchlist",
			handler: getWatchlistEndpoint,
		},
		{
			path: "/permissions",
			handler: updateUserPermissionsEndpoint,
		},
		{
			path: "/watchlist",
			handler: addToWatchlistEndpoint,
		},
		{
			path: "/watchlist",
			handler: deleteFromWatchlistEndpoint,
		},
		{
			path: "/videoProgress",
			handler: getUserVideoProgressEndpoint,
		},
		{
			path: "/videoProgress",
			handler: updateUserVideoProgressEndpoint,
		},
		{
			path: "/tvShows",
			handler: getTVShowsEndpoint,
		},
	];

	for (const endpoint of endpoints) {
		app.use(endpoint.path, endpoint.handler);
	}
}
