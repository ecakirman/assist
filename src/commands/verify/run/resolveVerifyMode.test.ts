import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveVerifyMode } from "./resolveVerifyMode";

function withEnv(env: { CI?: string; VERIFY_MODE?: string }): void {
	vi.stubEnv("CI", env.CI ?? "");
	vi.stubEnv("VERIFY_MODE", env.VERIFY_MODE ?? "");
}

describe("resolveVerifyMode", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("defaults to fix", () => {
		withEnv({});
		expect(resolveVerifyMode()).toBe("fix");
	});

	it("uses check when CI is truthy", () => {
		withEnv({ CI: "true" });
		expect(resolveVerifyMode()).toBe("check");
	});

	it("lets VERIFY_MODE override CI", () => {
		withEnv({ CI: "true", VERIFY_MODE: "fix" });
		expect(resolveVerifyMode()).toBe("fix");
	});

	it("honours VERIFY_MODE=check", () => {
		withEnv({ VERIFY_MODE: "check" });
		expect(resolveVerifyMode()).toBe("check");
	});

	it("ignores an unrecognised VERIFY_MODE", () => {
		withEnv({ CI: "1", VERIFY_MODE: "bogus" });
		expect(resolveVerifyMode()).toBe("check");
	});
});
