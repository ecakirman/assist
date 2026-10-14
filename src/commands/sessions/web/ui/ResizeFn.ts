export type ResizeMode = "claim" | "refresh";

export type ResizeFn = (
	sessionId: string,
	cols: number,
	rows: number,
	mode?: ResizeMode,
) => void;
