import { useCallback, useRef, useState } from "react";

export function useActiveId() {
	const [activeId, setActiveId] = useState<string | null>(null);
	const activeIdRef = useRef(activeId);
	activeIdRef.current = activeId;
	const getActiveId = useCallback(() => activeIdRef.current, []);
	return { activeId, setActiveId, getActiveId };
}
