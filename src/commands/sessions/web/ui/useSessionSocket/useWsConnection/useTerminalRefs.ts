import { useRef } from "react";

export function useTerminalRefs() {
	const buffers = useRef(new Map<string, string>());
	const handlers = useRef(new Map<string, (data: string) => void>());
	return { buffers, handlers };
}
