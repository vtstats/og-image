export type Catalog = {
	vtubers: VTuber[];
};

export type VTuber = {
	vtuberId: string;
	nativeName: string;
	englishName: string;
	japaneseName: string;
	thumbnailUrl: string;
	twitterUsername: string;
};

export const enum StreamStatus {
	SCHEDULED = 'SCHEDULED',
	LIVE = 'LIVE',
	ENDED = 'ENDED',
}

export type Stream = {
	streamId: number;
	platformId: string;
	title: string;
	highlightedTitle?: string;
	vtuberId: string;
	thumbnailUrl: string;

	status: StreamStatus;

	scheduleTime?: number;
	startTime?: number;
	endTime?: number;
	updatedAt: number;

	viewerAvg?: number;
	viewerMax?: number;
	likeMax?: number;
};

export const enum StreamEventKind {
	YOUTUBE_SUPER_CHAT = 'YOUTUBE_SUPER_CHAT',
	YOUTUBE_SUPER_STICKER = 'YOUTUBE_SUPER_STICKER',
	YOUTUBE_NEW_MEMBER = 'YOUTUBE_NEW_MEMBER',
	YOUTUBE_MEMBER_MILESTONE = 'YOUTUBE_MEMBER_MILESTONE',
	TWITCH_CHEERING = 'TWITCH_CHEERING',
	TWITCH_HYPER_CHAT = 'TWITCH_HYPER_CHAT',
}

export type StreamsEvent =
	| {
			time: number;
			kind: StreamEventKind.YOUTUBE_SUPER_CHAT;
			value: { amount: string; currencyCode: string };
	  }
	| {
			time: number;
			kind: StreamEventKind.YOUTUBE_SUPER_STICKER;
			value: { amount: string; currencyCode: string };
	  }
	| {
			time: number;
			kind: StreamEventKind.YOUTUBE_NEW_MEMBER;
	  }
	| {
			time: number;
			kind: StreamEventKind.YOUTUBE_MEMBER_MILESTONE;
	  }
	| {
			time: number;
			kind: StreamEventKind.TWITCH_CHEERING;
			value: { bits: number };
	  }
	| {
			time: number;
			kind: StreamEventKind.TWITCH_HYPER_CHAT;
			value: { amount: string; currency_code: string };
	  };

const baseUrl = 'https://vt-api.poi.cat/api/v4';

export const getVTuber = async (vtuberId: string): Promise<VTuber | undefined> => {
	const catalog: Catalog = await fetch(`${baseUrl}/catalog`, {
		cf: { cacheTtl: 60 * 60, cacheEverything: true },
	}).then((res) => res.json());

	const { vtubers = [] } = catalog;

	return vtubers.find((v) => v.vtuberId === vtuberId);
};

export const getStream = async (platform: string, platformId: string): Promise<Stream> => {
	return fetch(`${baseUrl}/streams?platform=${platform.toUpperCase()}&platformId=${platformId}`, {
		cf: { cacheTtl: 5 * 60, cacheEverything: true },
	}).then((res) => res.json());
};

export const getStreamRevenue = async (streamId: number): Promise<number> => {
	const events: StreamsEvent[] = await fetch(`${baseUrl}/stream-events?streamId=${streamId}`, {
		cf: { cacheTtl: 5 * 60, cacheEverything: true },
	}).then((res) => res.json());

	const rates: Record<string, number> = await fetch(`${baseUrl}/exchange-rates`, {
		cf: { cacheTtl: 60 * 60 * 24 * 10, cacheEverything: true },
	}).then((res) => res.json());

	return events.reduce((total, event) => {
		let amount: number | undefined;
		switch (event.kind) {
			case StreamEventKind.YOUTUBE_SUPER_CHAT: {
				amount = Number.parseFloat(event.value.amount) * (rates['JPY'] / rates[event.value.currencyCode]);
				break;
			}
			case StreamEventKind.YOUTUBE_SUPER_STICKER: {
				amount = Number.parseFloat(event.value.amount) * (rates['JPY'] / rates[event.value.currencyCode]);
				break;
			}
			case StreamEventKind.TWITCH_CHEERING: {
				amount = (event.value.bits / 100) * (rates['JPY'] / rates['USD']);
				break;
			}
			case StreamEventKind.TWITCH_HYPER_CHAT: {
				amount = Number.parseFloat(event.value.amount) * (rates['JPY'] / rates[event.value.currency_code]);
				break;
			}
		}
		if (amount && !isNaN(amount)) {
			return total + amount;
		} else {
			return total;
		}
	}, 0);
};
