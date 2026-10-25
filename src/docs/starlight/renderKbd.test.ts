import { describe, expect, it } from "vitest";
import { renderKbd } from "./renderKbd";

describe("renderKbd", () => {
	it("renders each key of the chord as a key cap", () => {
		expect(renderKbd("Enter")).toBe(
			'<kbd class="assist-kbd"><kbd>Enter</kbd></kbd>',
		);
		expect(renderKbd("Mod+.")).toContain("<kbd>.</kbd>");
	});

	it("renders modifiers as a macOS symbol and a name for other systems", () => {
		const html = renderKbd("Mod+N");
		expect(html).toContain(
			'<kbd><span class="assist-kbd-mac">⌘</span><span class="assist-kbd-other">Ctrl</span></kbd>',
		);
		expect(renderKbd("Alt+Shift+Tab")).toContain(
			'<span class="assist-kbd-mac">⇧</span><span class="assist-kbd-other">Shift</span>',
		);
	});

	it("escapes keys", () => {
		expect(renderKbd("<")).toContain("<kbd>&lt;</kbd>");
	});
});
