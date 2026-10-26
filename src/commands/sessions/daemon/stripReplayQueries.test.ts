import { describe, expect, it } from "vitest";
import { stripReplayQueries } from "./stripReplayQueries";

describe("stripReplayQueries", () => {
	it("removes a cursor-position report request", () => {
		expect(stripReplayQueries("before\x1b[6nafter")).toBe("beforeafter");
	});

	it("removes a private-mode cursor-position report request", () => {
		expect(stripReplayQueries("\x1b[?6n")).toBe("");
	});

	it("removes device-attributes requests (primary, secondary, tertiary)", () => {
		expect(stripReplayQueries("\x1b[c\x1b[0c\x1b[>c\x1b[>0c\x1b[=c")).toBe("");
	});

	it("removes focus-tracking enable and disable", () => {
		expect(stripReplayQueries("\x1b[?1004h\x1b[?1004l")).toBe("");
	});

	it("removes colour queries with either terminator", () => {
		expect(
			stripReplayQueries("a\x1b]11;?\x07b\x1b]10;?\x1b\\c\x1b]12;?\x07"),
		).toBe("abc");
	});

	it("preserves colour sets", () => {
		const output = "\x1b]11;rgb:ffff/ffff/ffff\x07";
		expect(stripReplayQueries(output)).toBe(output);
	});

	it("strips the reported #569 startup burst", () => {
		expect(stripReplayQueries("\x1b[?1004h\x1b[6ndone")).toBe("done");
	});

	it("preserves normal text and colour/cursor sequences", () => {
		const output = "\x1b[32mhello\x1b[0m\r\n\x1b[2J\x1b[H$ ";
		expect(stripReplayQueries(output)).toBe(output);
	});

	it("preserves the alternate-screen and bracketed-paste mode sets", () => {
		const output = "\x1b[?1049h\x1b[?2004hbody\x1b[?1049l";
		expect(stripReplayQueries(output)).toBe(output);
	});
});
