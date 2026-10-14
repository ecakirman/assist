import { readFileSync, writeFileSync } from "node:fs";
import { daemonLog } from "./daemonLog";
import { daemonPaths } from "./daemonPaths";

type TerminalSize = { cols: number; rows: number };

const DEFAULT_SIZE: TerminalSize = { cols: 120, rows: 30 };

let remembered: TerminalSize | undefined;

export function rememberViewerSize(cols: number, rows: number): void {
	if (cols <= 0 || rows <= 0) return;
	if (remembered?.cols === cols && remembered.rows === rows) return;
	remembered = { cols, rows };
	try {
		writeFileSync(daemonPaths.viewerSize, JSON.stringify(remembered));
	} catch (error) {
		daemonLog(
			`viewer size ${cols}x${rows} not saved: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

export function viewerSize(): TerminalSize {
	remembered ??= readSavedSize();
	return remembered ?? DEFAULT_SIZE;
}

function readSavedSize(): TerminalSize | undefined {
	try {
		const { cols, rows } = JSON.parse(
			readFileSync(daemonPaths.viewerSize, "utf8"),
		) as Partial<TerminalSize>;
		if (typeof cols === "number" && typeof rows === "number" && cols > 0)
			return { cols, rows };
	} catch {}
	return undefined;
}
