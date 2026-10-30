import { describe, expect, it } from "vitest";
import { inboxMessageKey, parseInboxMessageKey } from "./inboxMessageKey";

describe("parseInboxMessageKey", () => {
	it("round-trips a message id that itself contains colons", () => {
		const key = inboxMessageKey("slack", "C123:1712345678.000100");
		expect(parseInboxMessageKey(key)).toEqual({
			source: "slack",
			messageId: "C123:1712345678.000100",
		});
	});

	it.each(["gmail", ":abc", "gmail:"])("rejects %j", (key) => {
		expect(parseInboxMessageKey(key)).toBeUndefined();
	});
});
