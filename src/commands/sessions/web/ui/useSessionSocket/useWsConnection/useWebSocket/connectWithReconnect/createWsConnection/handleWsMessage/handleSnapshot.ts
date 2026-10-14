import type { WsDispatch } from "../../../WsDispatch";

export function handleSnapshot(
	msg: Record<string, unknown>,
	d: WsDispatch,
): void {
	const id = msg.sessionId as string;
	const data = msg.data as string;
	d.buffers.current?.set(id, data);
	d.handlers.current?.get(id)?.(`\x1bc${data}`);
}
