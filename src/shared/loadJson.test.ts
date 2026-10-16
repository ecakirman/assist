import type * as fs from "node:fs";
import {
	existsSync,
	mkdtempSync,
	readdirSync,
	readFileSync,
	rmSync,
} from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getStoreDir, loadJson, saveJson } from "./loadJson";

const failWrites = vi.hoisted(() => ({ on: false }));

vi.mock("node:fs", async (importOriginal) => {
	const actual = await importOriginal<typeof fs>();
	return {
		...actual,
		writeFileSync: (...args: Parameters<typeof actual.writeFileSync>) => {
			if (!failWrites.on) return actual.writeFileSync(...args);
			actual.writeFileSync(args[0], "{");
			throw Object.assign(new Error("ENOSPC: no space left on device"), {
				code: "ENOSPC",
			});
		},
	};
});

const original = process.env.ASSIST_STORE_DIR;
const dirs: string[] = [];

afterEach(() => {
	failWrites.on = false;
	process.env.ASSIST_STORE_DIR = original;
	for (const dir of dirs.splice(0))
		rmSync(dir, { recursive: true, force: true });
});

function tempStore(): string {
	const dir = mkdtempSync(join(tmpdir(), "loadjson-"));
	dirs.push(dir);
	process.env.ASSIST_STORE_DIR = dir;
	return dir;
}

describe("the assist store directory", () => {
	it("writes into the directory named by ASSIST_STORE_DIR", () => {
		const dir = tempStore();

		saveJson("worktrees.json", { "/git/repo-2": { clone: "/git/repo" } });

		expect(existsSync(join(dir, "worktrees.json"))).toBe(true);
		expect(loadJson("worktrees.json")).toEqual({
			"/git/repo-2": { clone: "/git/repo" },
		});
	});

	it("falls back to the home directory when the override is unset", () => {
		delete process.env.ASSIST_STORE_DIR;

		expect(getStoreDir()).toBe(join(homedir(), ".assist"));
	});
});

describe("saving to the store", () => {
	it("leaves the existing file intact when the write fails", () => {
		const dir = tempStore();
		saveJson("sessions.json", { a: 1 });
		const before = readFileSync(join(dir, "sessions.json"), "utf8");
		failWrites.on = true;

		expect(() => saveJson("sessions.json", { a: 2 })).toThrow("ENOSPC");

		expect(readFileSync(join(dir, "sessions.json"), "utf8")).toBe(before);
		expect(readdirSync(dir)).toEqual(["sessions.json"]);
	});
});
