import { describe, expect, it, vi } from "vitest";
import { kbdPlugin } from "./kbdPlugin";

function directive(name: string, label: string) {
	return { name, children: [{ value: label }] };
}

describe("kbdPlugin", () => {
	it("replaces a :kbd directive with key caps", () => {
		const replaceNode = vi.fn();
		kbdPlugin.textDirective(directive("kbd", "Alt+N"), { replaceNode });
		expect(replaceNode.mock.calls[0][1]).toEqual({
			type: "html",
			value: expect.stringContaining("<kbd>N</kbd>"),
		});
	});

	it("leaves other directives alone", () => {
		const replaceNode = vi.fn();
		kbdPlugin.textDirective(directive("other", "x"), { replaceNode });
		expect(replaceNode).not.toHaveBeenCalled();
	});

	it("fails on an empty chord", () => {
		expect(() =>
			kbdPlugin.textDirective(directive("kbd", " "), { replaceNode: vi.fn() }),
		).toThrow(/needs a chord/);
	});
});
