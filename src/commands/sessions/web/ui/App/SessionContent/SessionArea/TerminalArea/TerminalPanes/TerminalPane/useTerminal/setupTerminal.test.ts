// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { TerminalHandle } from "./createTerminal";
import { setupTerminal } from "./setupTerminal";

const fit = vi.fn();
let term = { cols: 120, rows: 40 };

vi.mock("./createTerminal", () => ({
	createTerminal: () => {
		term = {
			cols: 120,
			rows: 40,
			onData: vi.fn(),
			attachCustomKeyEventHandler: vi.fn(),
			write: vi.fn(),
		} as typeof term;
		return {
			term,
			fitAddon: { fit },
			dispose: vi.fn(),
		} as unknown as TerminalHandle;
	},
}));

let notifyResize: () => void = () => {};

class StubResizeObserver {
	constructor(callback: () => void) {
		notifyResize = callback;
	}
	observe() {}
	disconnect() {}
}

function paneOfSize(width: number, height: number): HTMLElement {
	const el = document.createElement("div");
	Object.defineProperty(el, "clientWidth", { value: width });
	Object.defineProperty(el, "clientHeight", { value: height });
	return el;
}

function attach(el: HTMLElement, mayResize = true) {
	const sendResize = vi.fn();
	setupTerminal(el, "session-1", {
		sendInput: vi.fn(),
		onOutput: () => () => {},
		sendResize,
		isStale: () => !mayResize,
		mayResize: () => mayResize,
		mode: "dark",
	});
	return sendResize;
}

beforeEach(() => {
	fit.mockClear();
	vi.stubGlobal("ResizeObserver", StubResizeObserver);
	vi.useFakeTimers();
});

afterEach(() => {
	vi.useRealTimers();
});

describe("setupTerminal resize reporting", () => {
	it("fits and reports the terminal size when the split changes", () => {
		const sendResize = attach(paneOfSize(600, 400));

		notifyResize();
		vi.runAllTimers();

		expect(fit).toHaveBeenCalled();
		expect(sendResize).toHaveBeenCalledWith("session-1", 120, 40, undefined);
	});

	it("asks for a redraw when the fit changes the terminal's size", () => {
		fit.mockImplementationOnce(() => {
			term.cols = 200;
		});
		const sendResize = attach(paneOfSize(600, 400));

		notifyResize();
		vi.runAllTimers();

		expect(sendResize).toHaveBeenCalledWith("session-1", 200, 40, "refresh");
	});

	it("reports once after a burst of resizes settles", () => {
		const sendResize = attach(paneOfSize(600, 400));

		notifyResize();
		notifyResize();
		notifyResize();
		expect(sendResize).not.toHaveBeenCalled();
		vi.runAllTimers();

		expect(fit).toHaveBeenCalledOnce();
		expect(sendResize).toHaveBeenCalledOnce();
	});

	it("stays silent while the pane is collapsed by full mode", () => {
		const sendResize = attach(paneOfSize(0, 0));

		notifyResize();
		vi.runAllTimers();

		expect(fit).not.toHaveBeenCalled();
		expect(sendResize).not.toHaveBeenCalled();
	});

	it("stays silent while it may not size the session", () => {
		const sendResize = attach(paneOfSize(600, 400), false);

		notifyResize();
		vi.runAllTimers();

		expect(sendResize).not.toHaveBeenCalled();
	});
});

describe("setupTerminal output replay", () => {
	it("rewrites the buffered output that was dropped while stale", () => {
		let stale = true;
		const { handle } = setupTerminal(paneOfSize(600, 400), "session-1", {
			sendInput: vi.fn(),
			onOutput: (_id, handler) => {
				handler("crash reason");
				return () => {};
			},
			sendResize: vi.fn(),
			isStale: () => stale,
			mayResize: () => true,
			mode: "dark",
		});
		expect(handle.term.write).not.toHaveBeenCalled();

		stale = false;
		handle.replayOutput();

		expect(handle.term.write).toHaveBeenCalledWith("crash reason");
	});
});
