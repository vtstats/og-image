/** @jsxImportSource . */

import { StreamStatus, getStream, getStreamRevenue, getVTuber } from './apis';
import { loadImage } from './image';
import { render } from './og-image';
import { StreamOgImage } from './stream';
import { initWasm } from './wasm';

export default {
	async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
		const cache = caches.default;
		let res: Response | null | undefined = await cache.match(request.url);

		if (!res) {
			const url = new URL(request.url);

			res = await fetchStreamOgImage(url.pathname);

			if (res) {
				ctx.waitUntil(cache.put(request.url, res.clone()));
			}
		}

		if (res) return res;

		return new Response('', { status: 404 });
	},
};

const fetchStreamOgImage = async (pathname: string): Promise<Response | null> => {
	const match = /^\/(youtube|twitch)-stream\/([A-Za-z0-9_-]*)\.png$/.exec(pathname);

	if (!match) {
		return null;
	}

	const stream = await getStream(match[1], match[2]);

	if (!stream || !('title' in stream)) {
		return null;
	}

	const [_, vtuber] = await Promise.all([initWasm(), getVTuber(stream.vtuberId)]);

	const [revenue, streamThumbnail, vtuberThumbnail] = await Promise.all([
		getStreamRevenue(stream.streamId),
		loadImage(stream.thumbnailUrl),
		loadImage(vtuber?.thumbnailUrl),
	]);

	const res = await render(
		<StreamOgImage
			stream={stream}
			revenue={revenue}
			vtuberName={vtuber?.nativeName || stream.vtuberId}
			streamThumbnail={streamThumbnail}
			vtuberThumbnail={vtuberThumbnail}
		/>,
	);

	res.headers.append(
		'cache-control',
		stream.status === StreamStatus.ENDED
			? 'max-age=86400 s-max-age=86400' // 1 day
			: 'max-age=600 s-max-age=600', // 1 hour
	);

	return res;
};
