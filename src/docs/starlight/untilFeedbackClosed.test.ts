// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { untilFeedbackClosed } from "./untilFeedbackClosed";

function openPopover(): HTMLElement {
	const host = document.createElement("div");
	host.setAttribute("data-assist-popover", "");
	document.body.append(host);
	return host;
}

async function settled(promise: Promise<void>): Promise<boolean> {
	let done = false;
	promise.then(() => {
		done = true;
	});
	await new Promise((resolve) => setTimeout(resolve, 0));
	return done;
}

afterEach(() => {
	document.body.replaceChildren();
});

describe("untilFeedbackClosed", () => {
	it("resolves at once when no popover is open", async () => {
		expect(await settled(untilFeedbackClosed(document))).toBe(true);
	});

	it("waits for the popover to close", async () => {
		const popover = openPopover();
		const closed = untilFeedbackClosed(document);
		expect(await settled(closed)).toBe(false);
		document.body.append(document.createElement("p"));
		expect(await settled(closed)).toBe(false);
		popover.remove();
		expect(await settled(closed)).toBe(true);
	});
});
