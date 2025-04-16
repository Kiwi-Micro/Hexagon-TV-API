type Video = {
	id: number;
	name: string;
	description: string;
	category: string;
	thumbnailURL: string;
	videoURL: string;
	date: string;
	ageRating: string;
	ageRatingInfo: string;
	urlName: string;
	isPartOfTVShow: string;
	tvShowId: string;
};

type Watchlist = {
	id: number;
	userId: string;
	videoId: string;
};

type WatchlistWithVideoData = {
	id: number;
	userId: string;
	videoId: string;
	video: Video;
};

export type { Video, Watchlist, WatchlistWithVideoData };
