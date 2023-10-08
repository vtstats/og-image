const jsx = (type: string, props: any): any => ({ type, props });

export { jsx, jsx as jsxs };

declare global {
	namespace JSX {
		interface IntrinsicElements {
			img: any;
			div: any;
			span: any;
			svg: any;
			path: any;
		}
	}
}
