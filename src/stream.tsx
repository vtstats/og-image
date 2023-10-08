/** @jsxImportSource . */

import { formatDuration, lightFormat } from 'date-fns';
import { Stream, StreamStatus } from './apis';

export const StreamOgImage = ({
	stream,
	vtuberName,
	streamThumbnail,
	vtuberThumbnail,
	revenue,
}: {
	stream: Stream;
	vtuberName: string;
	vtuberThumbnail?: ArrayBuffer | null;
	streamThumbnail?: ArrayBuffer | null;
	revenue: number;
}) => (
	<div
		style={{
			height: '100%',
			width: '100%',
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'center',
			backgroundColor: '#fff',
			fontSize: 16,
			alignItems: 'center',
		}}
	>
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				height: '100%',
				padding: '25px 0',
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					maxWidth: '480px',
					alignItems: 'center',
					height: '50px',
				}}
			>
				{vtuberThumbnail && <img style={{ marginRight: '8px', borderRadius: '9999px' }} src={vtuberThumbnail} width="36px" height="36px" />}

				<span
					style={{
						fontWeight: 600,
						fontSize: 18,
						overflow: 'hidden',
						fontFamily: 'Noto Sans CJK JP',
						maxHeight: '50px',
					}}
				>
					{stream.title.replace(/\s/g, '')}
				</span>
			</div>

			{streamThumbnail && (
				<img
					style={{
						width: 520 + 'px',
						height: (520 * 9) / 16 + 'px',
					}}
					src={streamThumbnail}
				/>
			)}
		</div>

		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				marginLeft: '20px',
				fontFamily: 'Roboto',
				height: '100%',
				padding: '25px 0',
			}}
		>
			<Logo />

			<div
				style={{
					flexGrow: 1,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					gap: '8px',
				}}
			>
				<div style={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
					<Stats label="Streamer" value={vtuberName} />
					<Stats label="Status" value={<Status status={stream.status} />} />
				</div>

				{hasValue(stream.scheduleTime) && stream.status === StreamStatus.SCHEDULED && (
					<Stats label="Schedule time" value={lightFormat(stream.scheduleTime + 9 * 60 * 60 * 1000, "yyyy-MM-dd HH:mm 'JST'")} />
				)}

				{hasValue(stream.startTime) && (
					<Stats label="Start time" value={lightFormat(stream.startTime + 9 * 60 * 60 * 1000, "yyyy-MM-dd HH:mm 'JST'")} />
				)}

				{hasValue(stream.endTime) && (
					<Stats label="End time" value={lightFormat(stream.endTime + 9 * 60 * 60 * 1000, "yyyy-MM-dd HH:mm 'JST'")} />
				)}

				{hasValue(stream.startTime) && hasValue(stream.endTime) && (
					<Stats label="Duration" value={<FormatDuration start={stream.startTime} end={stream.endTime} />} />
				)}

				<div style={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
					{(hasValue(stream.viewerAvg) || hasValue(stream.viewerMax)) && (
						<Stats label="Viewers" value={stream.viewerAvg?.toLocaleString() + ' / ' + stream.viewerMax?.toLocaleString()} />
					)}

					{hasValue(stream.likeMax) && <Stats label="Likes" value={stream.likeMax.toLocaleString()} />}
				</div>

				{hasValue(revenue) && <Stats label="Revenue" value={'JP¥' + revenue.toLocaleString()} />}
			</div>
		</div>
	</div>
);

const FormatDuration = ({ end, start }: { start: number; end: number }) => {
	const delta = (end - start) / 1000;
	const hours = Math.floor(delta / 3600);
	const minutes = Math.floor((delta - hours * 3600) / 60);
	return formatDuration({ hours, minutes });
};

const Status = ({ status }: { status: StreamStatus }) => {
	switch (status) {
		case StreamStatus.ENDED: {
			return (
				<span
					style={{
						color: '#22543D',
						backgroundColor: '#C6F6D5',
						borderRadius: '6px',
						paddingLeft: '8px',
						paddingRight: '8px',
						fontWeight: 500,
					}}
				>
					ENDED
				</span>
			);
		}
		case StreamStatus.LIVE: {
			return (
				<span
					style={{
						color: '#822727',
						backgroundColor: '#FED7D7',
						borderRadius: '6px',
						paddingLeft: '8px',
						paddingRight: '8px',
						fontWeight: 500,
					}}
				>
					LIVE
				</span>
			);
		}
		case StreamStatus.SCHEDULED: {
			return (
				<span
					style={{
						color: '#1A202C',
						backgroundColor: '#EDF2F7',
						borderRadius: '6px',
						paddingLeft: '8px',
						paddingRight: '8px',
						fontWeight: 500,
					}}
				>
					{status.toUpperCase()}
				</span>
			);
		}
	}
};

const Logo = () => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
			height: '50px',
		}}
	>
		<svg xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }} width="20" height="26">
			<path
				fill="#009688"
				d="M1.6.7C1 1 .6 1.4.4 2L.3 8.1v5.8l.2.3.3.3 1.5-3 2.6-5.8 1.2-2.5-.5-.8-.8-1a26.4 26.4 0 0 1-1-.3C2.9.5 2.4.5 1.7.7M5.8 2l.5.7.2-.4L6 2h-.2m1 .8-.3.3v.1a74 74 0 0 1 3.2 4.5l.5.7 2-3.4-.3-.2a44.2 44.2 0 0 1-1-.5 52 52 0 0 0-1-.5 54.2 54.2 0 0 1-1.2-.5A59.2 59.2 0 0 0 7 2.6L7 2.5l-.2.3M5.7 5 3.5 9.7a5935.1 5935.1 0 0 0-2 4.3c-.4.8-.4.9-.3 1 .1.3 3.2 4 3.3 4l.9-1.5 4.5-8.3.1-.3-.2-.3A629.5 629.5 0 0 1 8 6a59 59 0 0 0-1.6-2.4L5.7 5m5.8 2a23.8 23.8 0 0 1-1 1.9h-.1l4 5.7a466 466 0 0 0 2 2.8l.1.3 1.6-3 1.6-3v-1.3c0-2.1 0-2-3.1-3.5a59 59 0 0 1-1.4-.6L12.6 5l-1 1.9M10 9.6 6 17.2a39 39 0 0 1-1.3 2.2l1.4 1.7a116.8 116.8 0 0 0 1.5 1.8l.2.1.7-.3a236.5 236.5 0 0 1 2.8-1.4 431.8 431.8 0 0 0 3.2-1.5l1.2-.6.3-.5.3-.6h.1c0-.1 0-.1 0 0l-1.2-1.7-2.8-4a456.1 456.1 0 0 0-2-2.8l-.1-.3-.2.3m8.1 5.7L16.8 18l.1.2c.2.3.2.3 1.2-.1 1-.5 1.2-.7 1.5-1.2l.1-.3v-4l-1.5 2.7m-18-.2v.6l.2-.3c.2-.4.2-.4 0-.6l-.1-.2v.5m.5.5-.3.6-.2.5v3.5c0 4 0 4 .5 4.5s.3.7 1.8-2.2a277.2 277.2 0 0 1 1.5-2.7l.2-.4-1.7-2C.8 15.2 1 15.3.8 15.6m15.7 3a1.3 1.3 0 0 0-.1.2h.3v-.2l-.1-.2-.1.2M4 20.8a672.2 672.2 0 0 1-1.4 2.7c-1 2-1 1.8-.7 1.9.6.1 1 0 2.3-.7a223 223 0 0 1 3.1-1.5L4.6 20l-.6 1"
			/>
		</svg>
		<svg style={{ height: '24px', width: '96px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 90">
			<path
				fill="#009688"
				d="M153.8 35.6q0 3.3-1.9 5.1a6.2 6.2 0 0 1-2.5 1.5q-1 .3-2 .3a12.6 12.6 0 0 1-.9 0 10.4 10.4 0 0 1-5-1.3 13.7 13.7 0 0 1-1.7-1q.9-2.7.1-4.5a4.5 4.5 0 0 0-1.3-1.8 5.5 5.5 0 0 0-2-1q-.7-.2-1.7-.2a10.8 10.8 0 0 0-.6 0 10.7 10.7 0 0 0-1.8 0q-1 .2-1.7.6a5.5 5.5 0 0 0-.9.5 3.7 3.7 0 0 0-1.6 2.7 5.7 5.7 0 0 0 0 .7 4 4 0 0 0 .6 2.2l1 1.3a10.8 10.8 0 0 0 1.2.9 31.9 31.9 0 0 0 3.2 2l3.6 1.7a52.6 52.6 0 0 0 .2.1q4.1 1.7 8.2 3.8 4.1 2 7 5.3 3 3.3 3 7.5a13.5 13.5 0 0 1-4.9 10.5 20.2 20.2 0 0 1-2 1.6 26.9 26.9 0 0 1-11.4 4.4 35.4 35.4 0 0 1-5.2.3q-8.2 0-14.1-2.5a24.7 24.7 0 0 1-2-1q-6.7-3.7-6.7-9.2 0-3.3 2.5-5.4a8.8 8.8 0 0 1 5.8-2.1 11.2 11.2 0 0 1 .2 0 14 14 0 0 1 2.9.2q1.7.4 3 1.2a7 7 0 0 1 2 2q-1.8 1.3-1.8 3.6a3.7 3.7 0 0 0 1.4 3 5.4 5.4 0 0 0 .8.6 8.7 8.7 0 0 0 2.2.8q1 .3 2.2.4a18.3 18.3 0 0 0 1.4 0 14.5 14.5 0 0 0 2.4-.1q1.2-.2 2.2-.6a7.2 7.2 0 0 0 1.2-.7 5.6 5.6 0 0 0 1.2-1 4 4 0 0 0 1-2.8 3.9 3.9 0 0 0-.7-2.1l-1-1.2a10.6 10.6 0 0 0-1.3-1 35 35 0 0 0-3-1.8q-1.5-.9-3.4-1.7a58.9 58.9 0 0 0-.6-.3l-8.2-3.9q-4-2-7-5.4a12.1 12.1 0 0 1-2.1-3.5 10.7 10.7 0 0 1-.8-4 12.6 12.6 0 0 1 3.4-8.5 19.7 19.7 0 0 1 3-2.7 23.5 23.5 0 0 1 12.5-4.7 29.8 29.8 0 0 1 2.4 0q8.6 0 14.3 3.1a15.5 15.5 0 0 1 2.7 2q1.5 1.2 2.2 2.7a7.6 7.6 0 0 1 .8 3.4zm196.3 0q0 3.3-1.9 5.1a6.2 6.2 0 0 1-2.5 1.5q-1 .3-2 .3a12.6 12.6 0 0 1-.9 0 10.4 10.4 0 0 1-5-1.3 13.7 13.7 0 0 1-1.7-1q.9-2.7.1-4.5a4.5 4.5 0 0 0-1.3-1.8 5.5 5.5 0 0 0-2-1q-.7-.2-1.7-.2a10.8 10.8 0 0 0-.6 0 10.7 10.7 0 0 0-1.8 0q-1 .2-1.7.6a5.5 5.5 0 0 0-.9.5 3.7 3.7 0 0 0-1.6 2.7 5.7 5.7 0 0 0 0 .7 4 4 0 0 0 .6 2.2l1 1.3a10.8 10.8 0 0 0 1.2.9 31.9 31.9 0 0 0 3.2 2l3.6 1.7a52.6 52.6 0 0 0 .2.1q4.1 1.7 8.2 3.8 4.1 2 7 5.3 3 3.3 3 7.5a13.5 13.5 0 0 1-4.9 10.5 20.2 20.2 0 0 1-2 1.6 26.9 26.9 0 0 1-11.4 4.4 35.4 35.4 0 0 1-5.2.3q-8.2 0-14.1-2.5a24.7 24.7 0 0 1-2-1q-6.7-3.7-6.7-9.2 0-3.3 2.5-5.4a8.8 8.8 0 0 1 5.8-2.1 11.2 11.2 0 0 1 .2 0 14 14 0 0 1 2.9.2q1.7.4 3 1.2a7 7 0 0 1 2 2q-1.8 1.3-1.8 3.6a3.7 3.7 0 0 0 1.4 3 5.4 5.4 0 0 0 .8.6 8.7 8.7 0 0 0 2.2.8q1 .3 2.2.4a18.3 18.3 0 0 0 1.4 0 14.5 14.5 0 0 0 2.4-.1q1.2-.2 2.2-.6a7.2 7.2 0 0 0 1.2-.7 5.6 5.6 0 0 0 1.2-1 4 4 0 0 0 1-2.8 3.9 3.9 0 0 0-.7-2.1l-1-1.2a10.6 10.6 0 0 0-1.3-1 35 35 0 0 0-3-1.8q-1.5-.9-3.4-1.7a58.9 58.9 0 0 0-.6-.3l-8.2-3.9q-4-2-7-5.4a12.1 12.1 0 0 1-2.1-3.5 10.7 10.7 0 0 1-.8-4 12.6 12.6 0 0 1 3.4-8.5 19.7 19.7 0 0 1 3-2.7 23.5 23.5 0 0 1 12.5-4.7 29.8 29.8 0 0 1 2.4 0q8.6 0 14.3 3.1a15.5 15.5 0 0 1 2.7 2q1.5 1.2 2.2 2.7a7.6 7.6 0 0 1 .8 3.4zm-98 6.7V65a11.1 11.1 0 0 0 .4 3q1 3.6 4.5 4.9a10.2 10.2 0 0 0 .5.1 13.5 13.5 0 0 1-3.3 3.3 16.6 16.6 0 0 1-1.5.9q-3 1.6-6.5 1.6-6.8 0-8.9-5.7a12.2 12.2 0 0 1-.3-.9 20.3 20.3 0 0 1-14.7 6.6 25.7 25.7 0 0 1-.8 0 22.7 22.7 0 0 1-4.5-.4q-2.8-.6-5-1.9a13 13 0 0 1-1.5-1 11 11 0 0 1-3.9-7 16.3 16.3 0 0 1-.2-2.7 12.5 12.5 0 0 1 4.7-9.8 20.8 20.8 0 0 1 3.3-2.3 30.5 30.5 0 0 1 6.8-2.8q6.4-1.8 15.2-2v-9.5a12.2 12.2 0 0 0-.2-2.4q-.7-3.7-4.2-4.2a7.6 7.6 0 0 0-1 0 5.9 5.9 0 0 0-1.7.2 4.9 4.9 0 0 0-1.9 1.1 4.5 4.5 0 0 0-1.4 2.8 6.3 6.3 0 0 0 0 .8 6.1 6.1 0 0 0 1.1 3.6 8 8 0 0 0 .4.5 11.2 11.2 0 0 1-8.1 3.6 14.4 14.4 0 0 1-.4 0q-5.2 0-7.6-2.3A7.7 7.7 0 0 1 209 38a10.5 10.5 0 0 1 0-.9q0-5.6 6.8-9.2a30.8 30.8 0 0 1 9.5-3 40.7 40.7 0 0 1 6.5-.6 31.8 31.8 0 0 1 6.1.6q5 1 8.6 3.7a13.5 13.5 0 0 1 4.8 7q.7 2.4.8 5.2a29.4 29.4 0 0 1 0 1.5zM34.4 68l9.7-30.9a23.6 23.6 0 0 0 .8-2.7q.3-1.8.3-3.3a10 10 0 0 0-.5-3.3 9.1 9.1 0 0 0-.8-1.7 15.6 15.6 0 0 1 6.1-1.7 19 19 0 0 1 1.6 0q3.2 0 5.4 1.2a7.4 7.4 0 0 1 1.2.8 7 7 0 0 1 1.8 2.3 6.7 6.7 0 0 1 .6 3 14.4 14.4 0 0 1-.2 2.5q-.4 2.2-1.5 5L48.4 66.2Q46 73 43 75.7a9.3 9.3 0 0 1-3.3 2q-1.4.4-3.2.6a21.7 21.7 0 0 1-2.3.1q-3.8 0-6.4-1a9.2 9.2 0 0 1-2.5-1.5 10 10 0 0 1-1.8-2q-1.4-2.1-2.6-5.5a44.4 44.4 0 0 1-.7-2L11.6 37q-1.6-5-4.2-6.9a9.3 9.3 0 0 1 2.7-3.2 12 12 0 0 1 1.2-.9q2.7-1.7 5.7-1.7a11.9 11.9 0 0 1 4.6.9q3.3 1.3 5 4.8a17 17 0 0 1 1.2 4.1l6.6 34zm53.4-33H87v27a11.9 11.9 0 0 0 .3 2.3q.7 3.7 4 4a6.9 6.9 0 0 0 .6 0 12 12 0 0 0 6.8-2 18.4 18.4 0 0 0 3.2-2.9 2.9 2.9 0 0 1 2.2 1 3.9 3.9 0 0 1 .2.2q.9 1 1 2.9a7.4 7.4 0 0 1 0 .1q0 3.3-3.2 6.2a18.6 18.6 0 0 1-1.9 1.5 18.9 18.9 0 0 1-7.5 3.1 26 26 0 0 1-4.8.4 23.9 23.9 0 0 1-5.1-.5q-3.7-.8-6.4-2.8a15.1 15.1 0 0 1-.5-.4 11.8 11.8 0 0 1-4-6.2q-.6-2.3-.6-5V35a13 13 0 0 1-2-.2q-2.1-.4-3.4-1.5a5.4 5.4 0 0 1-1.7-3.9 6.8 6.8 0 0 1 0-.3 4.6 4.6 0 0 1 1.5-3.5 6 6 0 0 1 .5-.5 39 39 0 0 0 3.5.3 46.1 46.1 0 0 0 1.6 0v-3a12.3 12.3 0 0 0-.2-2.5q-.7-3.1-3.2-4.5a13.6 13.6 0 0 1 3.4-2.7A11.2 11.2 0 0 1 77 11a15 15 0 0 1 2.8.3q3.2.6 4.8 2.6 2.4 3 2.4 9v2.4h15.1a2.8 2.8 0 0 1 .7 1.6 3.7 3.7 0 0 1 0 .4 5.5 5.5 0 0 1-1.4 3.7q-.7 1-1.9 1.7a9.8 9.8 0 0 1-2.4 1.1q-2.6.9-6.4 1a52 52 0 0 1-2.9.1zm96 0h-.8v27a11.9 11.9 0 0 0 .3 2.3q.7 3.7 4 4a6.9 6.9 0 0 0 .6 0 12 12 0 0 0 6.8-2 18.4 18.4 0 0 0 3.2-2.9 2.9 2.9 0 0 1 2.2 1 3.9 3.9 0 0 1 .2.2q.9 1 1 2.9a7.4 7.4 0 0 1 0 .1q0 3.3-3.2 6.2a18.6 18.6 0 0 1-1.9 1.5 18.9 18.9 0 0 1-7.5 3.1 26 26 0 0 1-4.8.4 23.9 23.9 0 0 1-5.1-.5q-3.7-.8-6.4-2.8a15.1 15.1 0 0 1-.5-.4 11.8 11.8 0 0 1-4-6.2q-.6-2.3-.6-5V35a13 13 0 0 1-2-.2q-2.1-.4-3.4-1.5a5.4 5.4 0 0 1-1.7-3.9 6.8 6.8 0 0 1 0-.3 4.6 4.6 0 0 1 1.5-3.5 6 6 0 0 1 .5-.5 39 39 0 0 0 3.5.3 46.1 46.1 0 0 0 1.6 0v-3a12.3 12.3 0 0 0-.2-2.5q-.7-3.1-3.2-4.5a13.6 13.6 0 0 1 3.4-2.7A11.2 11.2 0 0 1 173 11a15 15 0 0 1 2.8.3q3.2.6 4.8 2.6 2.4 3 2.4 9v2.4h15.1a2.8 2.8 0 0 1 .7 1.6 3.7 3.7 0 0 1 0 .4 5.5 5.5 0 0 1-1.4 3.7q-.7 1-1.9 1.7a9.8 9.8 0 0 1-2.4 1.1q-2.6.9-6.4 1a52 52 0 0 1-2.9.1zm100.3 0h-.8v27a11.9 11.9 0 0 0 .3 2.3q.7 3.7 4 4a6.9 6.9 0 0 0 .6 0 12 12 0 0 0 6.8-2 18.4 18.4 0 0 0 3.2-2.9 2.9 2.9 0 0 1 2.2 1 3.9 3.9 0 0 1 .2.2q.9 1 1 2.9a7.4 7.4 0 0 1 0 .1q0 3.3-3.2 6.2a18.6 18.6 0 0 1-1.9 1.5 18.9 18.9 0 0 1-7.5 3.1 26 26 0 0 1-4.8.4 23.9 23.9 0 0 1-5.1-.5q-3.7-.8-6.4-2.8a15.1 15.1 0 0 1-.5-.4 11.8 11.8 0 0 1-4-6.2q-.6-2.3-.6-5V35a13 13 0 0 1-2-.2q-2.1-.4-3.4-1.5a5.4 5.4 0 0 1-1.7-3.9 6.8 6.8 0 0 1 0-.3 4.6 4.6 0 0 1 1.5-3.5 6 6 0 0 1 .5-.5 39 39 0 0 0 3.5.3 46.1 46.1 0 0 0 1.6 0v-3a12.3 12.3 0 0 0-.2-2.5q-.7-3.1-3.2-4.5a13.6 13.6 0 0 1 3.4-2.7 11.2 11.2 0 0 1 5.7-1.6 15 15 0 0 1 2.8.3q3.2.6 4.8 2.6 2.4 3 2.4 9v2.4h15.1a2.8 2.8 0 0 1 .7 1.6 3.7 3.7 0 0 1 0 .4 5.5 5.5 0 0 1-1.4 3.7q-.7 1-1.9 1.7a9.8 9.8 0 0 1-2.4 1.1q-2.6.9-6.4 1a52 52 0 0 1-2.9.1zm-47.7 30.1v-9.7a32 32 0 0 0-4.5.6q-5.3 1-7.2 3.9a7 7 0 0 0-1.3 4.1q0 4.8 5.2 5a12 12 0 0 0 .4 0 8.7 8.7 0 0 0 5.3-1.8 13.3 13.3 0 0 0 2.1-2z"
			></path>
		</svg>
	</div>
);

const Stats = ({ label, value }: { label: string; value: string }) => (
	<div style={{ display: 'flex', flexDirection: 'column' }}>
		<span style={{ color: '#878d97', fontSize: 14, paddingBottom: '2px' }}>{label}</span>
		<span>{value}</span>
	</div>
);

const hasValue = (v: any): v is number => {
	return typeof v === 'number' && v > 0;
};
