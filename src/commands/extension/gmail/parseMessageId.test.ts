import { describe, expect, it } from "vitest";
import { gmailPermalink } from "./gmailPermalink";
import { parseMessageId } from "./parseMessageId";

const ID =
	"<apm-better-life/apm-betterlife-platform/pull/1383/review/5707224411@github.com>";

describe("parseMessageId", () => {
	it("reads the header from a raw message", () => {
		expect(
			parseMessageId(`Subject: hi\r\nMessage-ID: ${ID}\r\nTo: a@b.com\r\n`),
		).toBe(ID);
	});

	it("reads the header from Show original's escaped HTML", () => {
		expect(
			parseMessageId(
				'<pre id="raw_message_text">Message-Id: &lt;a&amp;b@x.com&gt;\nTo: y</pre>',
			),
		).toBe("<a&b@x.com>");
	});

	it("reads a folded header", () => {
		expect(parseMessageId(`Message-ID:\r\n ${ID}\r\n`)).toBe(ID);
	});

	it("ignores In-Reply-To and References", () => {
		expect(
			parseMessageId("In-Reply-To: <x@y>\nReferences: <x@y>\nSubject: z"),
		).toBeUndefined();
	});
});

describe("gmailPermalink", () => {
	it("builds a rfc822msgid search link", () => {
		expect(gmailPermalink(ID)).toBe(
			"https://mail.google.com/mail/u/0/#search/rfc822msgid%3A%3Capm-better-life%2Fapm-betterlife-platform%2Fpull%2F1383%2Freview%2F5707224411%40github.com%3E",
		);
	});
});
