// @vitest-environment jsdom
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createDesignTheme } from "../../../../../../../../designSystem/createDesignTheme";
import type { DesignName } from "../../../../../../../../designSystem/DesignTokens";
import type { TerminalHandle } from "../createTerminal";
import { terminalTheme } from "../terminalTheme";
import { useTerminalTheme } from "./useTerminalTheme";

function openTerminal() {
	return {
		current: { term: { options: {} } } as unknown as TerminalHandle,
	};
}

const lookOf = (design: DesignName, mode: "dark" | "light") =>
	terminalTheme(createDesignTheme(design, mode).tokens);

describe("useTerminalTheme", () => {
	it("switches an open terminal's theme when the mode toggles", () => {
		const handleRef = openTerminal();
		const { rerender } = renderHook(
			({ look }) => useTerminalTheme(handleRef, look),
			{ initialProps: { look: lookOf("classic", "dark") } },
		);
		expect(handleRef.current.term.options.theme).toEqual(
			lookOf("classic", "dark").theme,
		);

		rerender({ look: lookOf("classic", "light") });

		expect(handleRef.current.term.options.theme).toEqual(
			lookOf("classic", "light").theme,
		);
	});

	it("switches the palette and font when the design toggles", () => {
		const handleRef = openTerminal();
		const { rerender } = renderHook(
			({ look }) => useTerminalTheme(handleRef, look),
			{ initialProps: { look: lookOf("classic", "dark") } },
		);

		rerender({ look: lookOf("slate", "dark") });

		const slate = lookOf("slate", "dark");
		expect(handleRef.current.term.options).toMatchObject(slate);
		expect(slate.theme.background).not.toBe(
			lookOf("classic", "dark").theme.background,
		);
	});
});
