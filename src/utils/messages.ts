function printEndpointReached(req: any, res: any) {
	console.log(
		`${new Date().toString().slice(4, 24)} GMT+0000: ${req.method} ${
			req.url
		} ${res.statusCode}`,
	);
}

export { printEndpointReached };
