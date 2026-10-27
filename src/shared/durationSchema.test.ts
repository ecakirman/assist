import { describe, expect, it } from "vitest";
import { durationSchema } from "./durationSchema";
import { assistConfigSchema } from "./types";

describe("durationSchema", () => {
	it("accepts a valid duration", () => {
		expect(durationSchema.safeParse("48h").success).toBe(true);
	});

	it("rejects an invalid duration with the parse error", () => {
		const result = durationSchema.safeParse("2d");
		expect(result.success).toBe(false);
		expect(result.error?.issues[0].message).toMatch(/Invalid duration "2d"/);
	});
});

describe("backup.staleAfter", () => {
	it("defaults to 32h", () => {
		expect(assistConfigSchema.parse({}).backup.staleAfter).toBe("32h");
	});

	it("rejects an invalid duration", () => {
		const result = assistConfigSchema.safeParse({
			backup: { staleAfter: "soon" },
		});
		expect(result.success).toBe(false);
	});
});
