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
	username: string;
	name: string;
	urlName: string;
	thumbnailURL: string;
};

export type { Video, Watchlist };
