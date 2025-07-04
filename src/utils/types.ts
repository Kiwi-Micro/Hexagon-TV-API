import { ResultSet, Row } from "@libsql/client";
import { getAgeRatingInfo } from "./ageRating";
import { runSQL } from "./database";
import { getWatchlist } from "./watchlist";

/**
 * The type for all the Item data.
 * @property id: The id of the item.
 * @property name: The name of the item.
 * @property description: The description of the item.
 * @property urlName: The name to use for the URL.
 * @property thumbnailURL: The URL to get the thumbnail from.
 * @property thumbnailURLKey: The key to use for the thumbnail.
 * @property dateReleased: The date the item was released.
 * @property ageRating: The age rating of the item.
 * @property ageRatingInfo: The age rating information of the item.
 * @property category: The category of the item.
 * @property videoURL: The URL to get the video from.
 * @property videoUrlKey: The key to use for the video.
 * @property isPartOfTVShow: Whether the item is part of a TV show.
 * @property tvShowId: The id of the TV show the item is part of (0 if not part of a TV show).
 * @property type: The type of the item (`video` or `series`).
 * @property isInWatchlist: Whether the item is in the user's watchlist.
 * @property progress: The progress through the item.
 * @property isCompleted: Whether the item is completed.
 */

export type Item = {
	id: number;
	name: string;
	description: string;
	urlName: string;
	thumbnailURL: string;
	thumbnailURLKey?: string;
	dateReleased: string;
	ageRating: string;
	ageRatingInfo: string;
	category: string;
	videoURL: string;
	videoURLKey?: string;
	isPartOfTVShow: boolean | number;
	tvShowId: number;
	type: string;
	isInWatchlist: boolean;
	progress?: number;
	isCompleted: boolean;
};

/**
 * This function parses the items from the database.
 * @param dbResults The items from the database.
 * @returns The formatted items.
 */

export async function parseItems(dbResults: ResultSet, userId: string): Promise<Item[]> {
	const userProgressResults: Row[] =
		(
			await runSQL(false, "SELECT * FROM continueWatching WHERE userId = ?", true, [
				userId,
			])
		).rows || [];

	return await Promise.all(
		(dbResults.rows || []).map(async (row: any) => ({
			id: row.id,
			name: row.name,
			description: row.description,
			urlName: row.urlName,
			thumbnailURL: row.thumbnailURL,
			thumbnailURLKey: row.thumbnailURLKey,
			dateReleased: row.dateReleased,
			ageRating: row.ageRating,
			ageRatingInfo:
				(await getAgeRatingInfo(row.ageRating)).data || "Age Rating not found",
			category: row.category,
			videoURL: row.videoURL,
			videoUrlKey: row.videoURLKey,
			isPartOfTVShow: row.isPartOfTVShow == 1 ? true : false,
			tvShowId: row.tvShowId,
			type: row.type,
			isInWatchlist: (
				await getWatchlist(userId)
			).data?.find((watchlistItem: Watchlist) => watchlistItem.itemId === row.id)
				? true
				: false,
			progress:
				(userProgressResults.find(
					(userProgressResult) => userProgressResult.videoId === row.id,
				)?.progress as number) || 0,
			isCompleted:
				userProgressResults.find(
					(userProgressResult) => userProgressResult.videoId === row.id,
				)?.isCompleted == 1
					? true
					: false,
		})),
	);
}

/**
 * The type for all the age rating Data.
 * @property id: The id of the age rating.
 * @property ageRating: The age rating.
 * @property ageRatingInfo: The age rating information.
 */

export type ageRating = {
	id: number;
	ageRating: string;
	ageRatingInfo: string;
};

/**
 * This function parses the age ratings from the database.
 * @param dbResults The age ratings results from the database.
 * @returns The parsed age ratings.
 */

export function parseAgeRatings(dbResults: any): ageRating[] {
	return (dbResults.rows || []).map((row: any) => ({
		id: row.id,
		ageRating: row.ageRating,
		ageRatingInfo: row.ageRatingInfo,
	}));
}

/**
 * The type for all the watchlist Data.
 * @property id: The id of the watchlist.
 * @property userId: The userId of the user.
 * @property type: The type of the watchlist (video or TV Show).
 * @property videoId: The id of the video (ONLY IF `type` is `video`).
 * @property tvShowId: The id of the TV Show (ONLY IF `type` is `series`).
 * @property video: The video data (See The `Video` Type), (ONLY IF `type` is `video`).
 * @property tvShow: The TV Show data (See The `TVShow` Type), (ONLY IF `type` is `series`).
 */

export type Watchlist = {
	id: number;
	userId: string;
	itemId: number;
	item?: Item;
};

/**
 * This function parses the watchlist from the database.
 * @param dbResults The watchlist results from the database.
 * @param videoResults The video results from the database.
 * @param tvShowResults The TV Show results from the database.
 * @returns The parsed watchlist.
 */

export function parseWatchlist(dbResults: any, itemsResults: any): Watchlist[] {
	return (dbResults.rows || []).map((row: any) => ({
		id: row.id,
		userId: row.userId,
		itemId: row.itemId,
		item: (itemsResults.rows || []).find((videoRow: any) => videoRow.id === row.itemId),
	}));
}

/**
 * The type for all the permission Data.
 * @property id: The id of the permission.
 * @property userId: The userId of the user.
 * @property isAdmin: Whether the user is an admin (WILL BYPASS OTHER PERMISSIONS IF TRUE).
 * @property canModifyPermissions: Whether the user can modify user permissions.
 * @property canModifyVideos: Whether the user can modify videos.
 * @property canModifyCategorys: Whether the user can modify categories.
 * @property canModifyTVShows: Whether the user can modify TV shows.
 * @property canModifyAgeRatings: Whether the user can modify age ratings.
 */

export type Permission = {
	id: number;
	userId: string;
	isAdmin: boolean;
	canModifyPermissions: boolean;
	canModifyItems: boolean;
	canModifyCategories: boolean;
	canModifyAgeRatings: boolean;
};

/**
 * This function parses the permissions from the database.
 * @param dbResults The permissions results from the database.
 * @returns The parsed permissions.
 */

export function parsePermissions(dbResults: any): Permission[] {
	return (dbResults.rows || []).map((row: any) => ({
		id: row.id,
		userId: row.userId,
		isAdmin: row.isAdmin == 1 ? true : false,
		canModifyPermissions: row.canModifyPermissions == 1 ? true : false,
		canModifyVideos: row.canModifyVideos == 1 ? true : false,
		canModifyCategories: row.canModifyCategories == 1 ? true : false,
		canModifyTVShows: row.canModifyTVShows == 1 ? true : false,
		canModifyAgeRatings: row.canModifyAgeRatings == 1 ? true : false,
	}));
}

/**
 * The type for all the category Data.
 * @property id: The id of the category.
 * @property categoryName: The name of the category.
 * @property urlName: The id of the category (Like a URLName).
 */

export type Category = {
	id: number;
	name: string;
	urlName: string;
	isSeries: boolean;
};

/**
 * This function parses the categories from the database.
 * @param dbResults The categories results from the database.
 * @returns The parsed categories.
 */

export function parseCategories(dbResults: any): Category[] {
	return (dbResults.rows || []).map((row: any) => ({
		id: row.id,
		categoryName: row.categoryName,
		urlName: row.urlName,
		isSeries: row.isSeries == 1 ? true : false,
	}));
}

/**
 * The type for all the video progress Data.
 * @property userId: The userId of the user.
 * @property videoId: The id of the video.
 * @property progress: The progress of the video.
 * @property isVideoCompleted: Whether the video is completed.
 */

export type VideoProgress = {
	userId: string;
	videoId: string;
	progressThroughVideo: number;
	isVideoCompleted: boolean;
};

/**
 * This function parses the video progress from the database.
 * @param dbResults The video progress results from the database.
 * @returns The parsed video progress.
 */

export function parseVideoProgress(dbResults: any): VideoProgress[] {
	return (dbResults.rows || []).map((row: any) => ({
		userId: row.userId,
		videoId: row.videoId,
		progressThroughVideo: row.progressThroughVideo,
		isVideoCompleted: row.isVideoCompleted == 1 ? true : false,
	}));
}

export type ReturnData<T> = {
	status: string;
	httpStatus: number;
	analyticsEventType: string;
	data: T | null;
};
