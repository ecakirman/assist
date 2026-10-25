// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { holdReloadsForFeedback } from "./holdReloadsForFeedback";

function registeredListeners(): Map<string, () => Promise<void>> {
	const listeners = new Map<string, () => Promise<void>>();
	holdReloadsForFeedback(
		{ on: (event, listener) => listeners.set(event, listener) },
		document,
	);
	return listeners;
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

describe("holdReloadsForFeedback", () => {
	it.each(["vite:beforeFullReload", "vite:ws:disconnect"])(
		"holds the %s reload until the popover closes",
		async (event) => {
			const listener = registeredListeners().get(event);
			const popover = document.createElement("div");
			popover.setAttribute("data-assist-popover", "");
			document.body.append(popover);
			const held = listener?.() ?? Promise.reject(new Error(event));
			expect(await settled(held)).toBe(false);
			popover.remove();
			expect(await settled(held)).toBe(true);
		},
	);
});
