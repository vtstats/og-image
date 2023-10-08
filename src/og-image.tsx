/** @jsxImportSource . */

import { Resvg } from '@resvg/resvg-wasm';
import satori from 'satori/wasm';

import { loadEmoji } from './emoji';
import { loadGoogleFont } from './google-fonts';

export const render = async (children: any): Promise<Response> => {
	const svg = await satori(children, {
		width: 800,
		height: 400,
		fonts: [
			{
				name: 'Noto Sans JP',
				data: await loadGoogleFont({ family: 'Noto Sans JP', weight: 400 }),
				weight: 400,
				style: 'normal',
			},
			{
				name: 'Roboto',
				data: await loadGoogleFont({ family: 'Roboto', weight: 400 }),
				weight: 400,
				style: 'normal',
			},
		],
		loadAdditionalAsset: async (code, text) => {
			if (code === 'emoji') {
				return loadEmoji(text);
			}

			return '';
		},
	});

	const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1600 } }).render().asPng();

	return new Response(png, {
		headers: { 'content-type': 'image/png' },
		status: 200,
		statusText: 'OK',
	});
};
