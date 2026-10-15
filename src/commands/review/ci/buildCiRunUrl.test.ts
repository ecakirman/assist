import { describe, expect, it } from "vitest";
import { buildCiRunUrl } from "./buildCiRunUrl";

describe("buildCiRunUrl", () => {
	it("builds the Actions run URL from the workflow env", () => {
		expect(
			buildCiRunUrl({
				GITHUB_SERVER_URL: "https://github.com",
				GITHUB_REPOSITORY: "o/r",
				GITHUB_RUN_ID: "42",
			}),
		).toBe("https://github.com/o/r/actions/runs/42");
	});

	it("returns undefined outside a workflow", () => {
		expect(buildCiRunUrl({})).toBeUndefined();
	});
});
