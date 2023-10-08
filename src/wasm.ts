import { init as initPngEncode } from '@jsquash/png/encode';
import { init as initWebpDecode } from '@jsquash/webp/decode';
import { initWasm as initResvg } from '@resvg/resvg-wasm';
import { init as initSatori } from 'satori/wasm';
import initYoga from 'yoga-wasm-web';

// @ts-ignore
import pngWasm from '../node_modules/@jsquash/png/codec/squoosh_png_bg.wasm';
// @ts-ignore
import webpWasm from '../node_modules/@jsquash/webp/codec/dec/webp_dec.wasm';
// @ts-ignore
import yogaWasm from '../node_modules/yoga-wasm-web/dist/yoga.wasm';
// @ts-ignore
import resvgWasm from '../node_modules/@resvg/resvg-wasm/index_bg.wasm';

export const initWasm = () => {
	return Promise.allSettled([
		initYoga(yogaWasm).then((yoga) => initSatori(yoga)),
		initResvg(resvgWasm),
		initWebpDecode(webpWasm),
		initPngEncode(pngWasm),
	]);
};
