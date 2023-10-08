const U200D = String.fromCharCode(8205);
const UFE0Fg = /\uFE0F/g;

const getIconCode = (char: string) => {
	return toCodePoint(char.indexOf(U200D) < 0 ? char.replace(UFE0Fg, '') : char);
};

const toCodePoint = (unicodeSurrogates: string) => {
	const r: string[] = [];
	let c = 0,
		p = 0,
		i = 0;

	while (i < unicodeSurrogates.length) {
		c = unicodeSurrogates.charCodeAt(i++);
		if (p) {
			r.push((65536 + ((p - 55296) << 10) + (c - 56320)).toString(16));
			p = 0;
		} else if (55296 <= c && c <= 56319) {
			p = c;
		} else {
			r.push(c.toString(16));
		}
	}

	return r.join('-');
};

export const loadEmoji = async (emoji: string): Promise<string> => {
	const res = await fetch(
		`https://cdn.jsdelivr.net/gh/svgmoji/svgmoji/packages/svgmoji__noto/svg/${getIconCode(emoji).toUpperCase()}.svg`,
		{ cf: { cacheTtl: 60 * 60 * 24 * 10, cacheEverything: true } },
	);
	const text = await res.text();
	return `data:image/svg+xml;base64,` + btoa(text);
};
