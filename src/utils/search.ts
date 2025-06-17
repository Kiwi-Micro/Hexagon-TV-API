import { getTVShows } from "./tvShow";
import { ReturnData, TVShow, Video } from "./types";
import { getVideos } from "./video";

/**
 * This function searches for videos and TV shows that match the query.
 * @param query The query to search for (Can be a video name, a TV show name, or a TV show episode name).
 * @param userId The userId of the user to search for.
 * @returns An array of videos and TV shows.
 */

export async function search(query: string, userId: string): Promise<ReturnData> {
	try {
		const videoResultsPromise = getVideos(userId);
		const tvShowResultsPromise = getTVShows(userId);

		const results = await Promise.all([videoResultsPromise, tvShowResultsPromise]);
		const resultsSoup = [...results[0].data, ...results[1].data];

		const lowerCaseQuery = query.toLowerCase();

		const filteredResults = resultsSoup
			.filter((item) => {
				const lowerCaseName = item.name.toLowerCase();
				return lowerCaseName.includes(lowerCaseQuery);
			})
			.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

		const resultsWithResultId = filteredResults.map((item, index) => {
			return {
				resultId: index,
				...item,
			};
		});

		return {
			status: "success",
			httpStatus: 200,
			analyticsEventType: "api.search.search",
			data: resultsWithResultId,
		};
	} catch (error: any) {
		console.error("Error searching:", error);
		return {
			status: "server error",
			httpStatus: 500,
			analyticsEventType: "api.search.search.failed",
			data: null,
		};
	}
}
