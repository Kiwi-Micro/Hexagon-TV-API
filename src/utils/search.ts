import { getTVShows } from "./tvShow";
import { TVShow, Video } from "./types";
import { getVideos } from "./video";

/**
 * This function searches for videos and TV shows that match the query.
 * @param query The query to search for (Can be a video name, a TV show name, or a TV show episode name).
 * @param userId The userId of the user to search for.
 * @returns An array of videos and TV shows.
 */

export async function search(query: string, userId: string): Promise<Video[] | TVShow[]> {
	const videoResultsPromise = getVideos(userId);
	const tvShowResultsPromise = getTVShows(userId);

	const results = await Promise.all([videoResultsPromise, tvShowResultsPromise]);
	const resultsSoup = [...results[0], ...results[1]];

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

	return resultsWithResultId;
}
