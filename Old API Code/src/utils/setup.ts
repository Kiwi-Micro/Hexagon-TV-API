// -- ITEMS --
import searchEndpoint from "../routes/READ/search";
import getItemsEndpoint from "../routes/READ/getItems";
import addItemsEndpoint from "../routes/WRITE/items/addItem";
import updateItemsEndpoint from "../routes/WRITE/items/updateItem";
import deleteItemsEndpoint from "../routes/WRITE/items/deleteItem";
// -- WATCHLIST --
import getWatchlistEndpoint from "../routes/READ/getWatchlist";
import addToWatchlistEndpoint from "../routes/WRITE/watchlists/addToWatchlist";
import deleteFromWatchlistEndpoint from "../routes/WRITE/watchlists/deleteFromWatchlist";
// -- PERMISSIONS --
import getUserPermissionsEndpoint from "../routes/READ/getUserPermissions";
import updateUserPermissionsEndpoint from "../routes/WRITE/permissions/updateUserPermissions";
// -- CATEGORIES --
import getCategoriesEndpoint from "../routes/READ/getCategories";
import addCategoryEndpoint from "../routes/WRITE/categories/addCategory";
import updateCategoryEndpoint from "../routes/WRITE/categories/updateCategory";
import deleteCategoryEndpoint from "../routes/WRITE/categories/deleteCategory";
// -- VIDEO PROGRESS --
import getUserVideoProgressEndpoint from "../routes/READ/getUserVideoProgress";
import updateUserVideoProgressEndpoint from "../routes/WRITE/videoProgress/updateUserVideoProgress";
// -- AGE RATINGS --
import getAgeRatingsEndpoint from "../routes/READ/getAgeRatings";
// -- UploadThing --
import uploadFilesEndpoint from "../routes/WRITE/uploadFiles";
import { createRouteHandler } from "uploadthing/express";
import config from "../../config.json";

export function createEndpoints(app: any) {
	const endpoints = [
		{
			path: "/items",
			handler: getItemsEndpoint,
		},
		{
			path: "/items",
			handler: addItemsEndpoint,
		},
		{
			path: "/items",
			handler: updateItemsEndpoint,
		},
		{
			path: "/items",
			handler: deleteItemsEndpoint,
		},
		{
			path: "/ageRatings",
			handler: getAgeRatingsEndpoint,
		},
		{
			path: "/categories",
			handler: getCategoriesEndpoint,
		},
		{
			path: "/items",
			handler: searchEndpoint,
		},
		{
			path: "/categories",
			handler: addCategoryEndpoint,
		},
		{
			path: "/categories",
			handler: updateCategoryEndpoint,
		},
		{
			path: "/categories",
			handler: deleteCategoryEndpoint,
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
			path: "/api/uploadthing",
			handler: createRouteHandler({
				router: uploadFilesEndpoint,
				config: {
					token: config[0]["UPLOADTHING_TOKEN"],
					logLevel: "Error",
				},
			}),
		},
	];

	for (const endpoint of endpoints) {
		app.use(endpoint.path, endpoint.handler);
	}
}
