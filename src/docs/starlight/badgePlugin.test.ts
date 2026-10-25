import { describe, expect, it, vi } from "vitest";
import { badgePlugin } from "./badgePlugin";

function render(label: string): string {
	const replaceNode = vi.fn();
	badgePlugin.textDirective(
		{ name: "badge", children: [{ value: label }] },
		{ replaceNode },
	);
	return replaceNode.mock.calls[0][1].value;
}

describe("badgePlugin", () => {
	it("renders the clone badge as the house icon", () => {
		expect(render("clone")).toContain("<svg");
	});

	it("renders a chip badge with its example label", () => {
		expect(render("serving")).toContain("serving :5173");
	});

	it("fails on an unknown badge", () => {
		expect(() => render("house")).toThrow(/Unknown :badge\[house\]/);
	});
});
