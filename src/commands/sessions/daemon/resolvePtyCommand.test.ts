import { afterEach, describe, expect, it, vi } from "vitest";
import { resolvePtyCommand } from "./resolvePtyCommand";

function onPlatform(platform: NodeJS.Platform): void {
	vi.spyOn(process, "platform", "get").mockReturnValue(platform);
}

describe("resolvePtyCommand", () => {
	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllEnvs();
	});

	it("runs through a login shell on Linux/macOS", () => {
		onPlatform("linux");
		vi.stubEnv("SHELL", "/bin/zsh");

		expect(resolvePtyCommand(["assist", "draft", "it's\nhere"])).toEqual({
			file: "/bin/zsh",
			args: ["-l", "-c", `exec 'assist' 'draft' 'it'\\''s\nhere'`],
		});
	});

	it("passes a multi-line assist argument to node directly on Windows", () => {
		onPlatform("win32");
		const prompt = "/draft for this configured command:\nline two\nline three";

		expect(resolvePtyCommand(["assist", "draft", prompt])).toEqual({
			file: process.execPath,
			args: [process.argv[1], "draft", prompt],
		});
	});

	it("still runs non-assist commands through cmd.exe on Windows", () => {
		onPlatform("win32");

		expect(resolvePtyCommand(["claude", "--resume", "abc"])).toEqual({
			file: "cmd.exe",
			args: ["/c", "claude", "--resume", "abc"],
		});
	});
});
