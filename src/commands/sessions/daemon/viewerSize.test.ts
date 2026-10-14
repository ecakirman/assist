import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { rememberViewerSize, viewerSize } from "./viewerSize";

const { file } = vi.hoisted(() => ({ file: { path: "" } }));

vi.mock("./daemonLog", () => ({ daemonLog: vi.fn() }));
vi.mock("./daemonPaths", () => ({
	daemonPaths: {
		get viewerSize() {
			return file.path;
		},
	},
}));

file.path = join(mkdtempSync(join(tmpdir(), "viewer-size-")), "size.json");

describe("viewerSize", () => {
	it("defaults to 120x30 before any viewer has sized a session", () => {
		expect(viewerSize()).toEqual({ cols: 120, rows: 30 });
	});

	it("picks up the size saved before a daemon restart", () => {
		writeFileSync(file.path, JSON.stringify({ cols: 267, rows: 78 }));

		expect(viewerSize()).toEqual({ cols: 267, rows: 78 });
	});

	it("saves the latest viewer size", () => {
		rememberViewerSize(132, 80);

		expect(viewerSize()).toEqual({ cols: 132, rows: 80 });
		expect(JSON.parse(readFileSync(file.path, "utf8"))).toEqual({
			cols: 132,
			rows: 80,
		});
	});
});
