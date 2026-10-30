import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { useMemo, useRef } from "react";
import type { Ownership } from "./Ownership";
import type { ResizeFn } from "../../../../../ResizeFn";
import { TakeOverOverlay } from "./TerminalPane/TakeOverOverlay";
import { useTerminal } from "./TerminalPane/useTerminal";
import { terminalTheme } from "./TerminalPane/useTerminal/terminalTheme";
import { terminalInset } from "./terminalFrameSx";

export function TerminalPane({
	sessionId,
	visible,
	ownership,
	ended,
	hasLastMessage,
	activeNode,
	onOutput,
	sendInput,
	sendResize,
}: {
	sessionId: string;
	visible: boolean;
	ownership: Ownership;
	ended: boolean;
	hasLastMessage: boolean;
	activeNode?: string;
	onOutput: (sessionId: string, handler: (data: string) => void) => () => void;
	sendInput: (sessionId: string, data: string) => void;
	sendResize: ResizeFn;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const { tokens } = useTheme();
	const look = useMemo(() => terminalTheme(tokens), [tokens]);
	const inactive = ownership === "other";
	const onPress = useTerminal(containerRef, sessionId, {
		visible,
		ownership,
		ended,
		look,
		sendInput,
		onOutput,
		sendResize,
	});

	return (
		<Box
			data-terminal-session-id={sessionId}
			sx={{
				position: "absolute",
				inset: terminalInset(hasLastMessage),
				visibility: visible ? "visible" : "hidden",
				pointerEvents: visible ? "auto" : "none",
			}}
			onPointerDownCapture={onPress}
		>
			<Box
				ref={containerRef}
				sx={{ position: "absolute", inset: 0, isolation: "isolate" }}
			/>
			{inactive && <TakeOverOverlay activeNode={activeNode} />}
		</Box>
	);
}
