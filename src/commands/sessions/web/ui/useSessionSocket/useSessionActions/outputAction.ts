type SendFn = (msg: object) => void;

type OutputHandler = (data: string) => void;

export function outputAction(
	send: SendFn,
	buffers: Map<string, string>,
	handlers: Map<string, OutputHandler>,
) {
	return (sessionId: string, handler: OutputHandler): (() => void) => {
		const buf = buffers.get(sessionId);
		if (buf) {
			handler(buf);
			send({ type: "snapshot", sessionId });
		}
		handlers.set(sessionId, handler);
		return () => handlers.delete(sessionId);
	};
}
