export async function loadGoogleFont({ family, weight }: { family: string; weight: number }) {
	const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&subset=latin`;

	const cssRes = await fetch(cssUrl, {
		headers: {
			// construct user agent to get TTF font
			'User-Agent':
				'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
		},
		cf: { cacheTtl: 60 * 60 * 24 * 10, cacheEverything: true },
	});

	const body = await cssRes.text();
	// Get the font URL from the CSS text
	const fontUrl = body.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/)?.[1];

	if (!fontUrl) {
		throw new Error('Could not find font URL');
	}

	const fontRes = await fetch(fontUrl, {
		cf: { cacheTtl: 60 * 60 * 24 * 10, cacheEverything: true },
	});

	return fontRes.arrayBuffer();
}
