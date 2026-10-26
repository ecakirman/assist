import { describe, expect, it } from "vitest";
import { renderIcon } from "./renderIcon";

describe("renderIcon", () => {
	it("renders a MUI icon's paths in a bare svg", () => {
		expect(renderIcon("OpenInFull")).toBe(
			'<span class="assist-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M21 11V3h-8l3.29 3.29-10 10L3 13v8h8l-3.29-3.29 10-10z"></path></svg></span>',
		);
	});

	it("fails on an unknown icon", () => {
		expect(() => renderIcon("NoSuchIcon")).toThrow(
			/Unknown :icon\[NoSuchIcon\]/,
		);
	});

	it("rejects an inherited property name", () => {
		expect(() => renderIcon("toString")).toThrow(/Unknown :icon/);
	});
});
