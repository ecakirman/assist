import { describe, expect, it } from "vitest";
import { isolatedEnv } from "./isolatedEnv";

describe("isolatedEnv", () => {
	it("keeps only the passthrough variables and points HOME at the capture dir", () => {
		const env = isolatedEnv("/tmp/assist-docs-x", {
			PATH: "/usr/bin",
			HOME: "/Users/real",
			ASSIST_DATABASE_URL: "postgresql://real",
			ASSIST_SESSION_ID: "7",
			GH_TOKEN: "secret",
		});
		expect(env).toEqual({
			PATH: "/usr/bin",
			HOME: "/tmp/assist-docs-x",
			USERPROFILE: "/tmp/assist-docs-x",
			XDG_CONFIG_HOME: "/tmp/assist-docs-x/.config",
			GIT_CONFIG_NOSYSTEM: "1",
			BROWSER: "none",
		});
	});
});
