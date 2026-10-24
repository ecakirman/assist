import { describe, expect, it } from "vitest";
import { enumerateConfigLeafKeys } from "../../shared/enumerateConfigLeafKeys";
import { assistConfigSchema } from "../../shared/types";
import { collectConfigKeys } from "./collectConfigKeys";

describe("collectConfigKeys", () => {
	it("lists every leaf key of the config schema", () => {
		expect(collectConfigKeys().map((item) => item.id)).toEqual(
			enumerateConfigLeafKeys(assistConfigSchema).map((key) => `config:${key}`),
		);
	});

	it("describes a key with its configHelp note and setter", () => {
		const item = collectConfigKeys().find(
			(entry) => entry.id === "config:commit.conventional",
		);
		expect(item?.description).toBe(
			"enforce conventional commit message format (assist config set commit.conventional true)",
		);
	});
});
