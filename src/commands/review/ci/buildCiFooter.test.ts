import { describe, expect, it } from "vitest";
import { buildCiFooter } from "./buildCiFooter";

const footer = buildCiFooter({
	claude: { harness: "claude", model: "claude-opus" },
	codex: { harness: "codex", model: "gpt-6.1-sol" },
	synthesis: { harness: "claude", model: "claude-sonnet" },
});

describe("buildCiFooter", () => {
	it("lists each slot's configured harness:model", () => {
		expect(footer).toContain(
			"Models: reviewer 1 `claude:claude-opus`, reviewer 2 `codex:gpt-6.1-sol`, synthesis `claude:claude-sonnet`.",
		);
	});

	it("says toggling draft and ready for review re-runs the review", () => {
		expect(footer).toContain(
			"mark the PR as draft and then ready for review again",
		);
	});
});
