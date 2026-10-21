import { describe, expect, it } from "vitest";
import { runConfigSchema } from "../../shared/runConfigSchema";
import { runAddHelpText } from "./runAddHelpText";

describe("runAddHelpText", () => {
	it.each(Object.keys(runConfigSchema.shape))(
		"documents the %s run entry property",
		(key) => {
			expect(runAddHelpText).toMatch(new RegExp(`^  ${key} `, "m"));
		},
	);

	it("says commands are spawned without a shell", () => {
		expect(runAddHelpText).toContain("without a shell");
	});
});
