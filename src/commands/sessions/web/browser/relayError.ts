export function relayError(message: string, status: number): Error {
	return Object.assign(new Error(message), { status });
}
