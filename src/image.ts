import encode from '@jsquash/png/encode';
import decode from '@jsquash/webp/decode';

export const loadImage = async (url?: string): Promise<ArrayBuffer | null> => {
	if (!url) return null;

	if (url.endsWith('png') || url.endsWith('jpg')) {
		const arrayBuffer = await fetch(url, {
			cf: { cacheTtl: 60 * 60 * 2, cacheEverything: true },
		}).then((res) => res.arrayBuffer());
		return arrayBuffer;
	}

	if (url.endsWith('webp')) {
		const arrayBuffer = await fetch(url, {
			cf: { cacheTtl: 60 * 60 * 2, cacheEverything: true },
		}).then((res) => res.arrayBuffer());
		const raw = await decode(arrayBuffer);
		const png = (await encode(raw)) as Uint8Array;
		return png.buffer;
	}

	console.error(`Unsupported image url: ${url}`);

	return null;
};
