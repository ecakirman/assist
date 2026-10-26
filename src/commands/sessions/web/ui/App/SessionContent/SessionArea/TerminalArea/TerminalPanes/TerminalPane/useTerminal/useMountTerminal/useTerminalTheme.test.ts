// @vitest-environment jsdom
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { TerminalHandle } from "../createTerminal";
import { terminalTheme } from "../terminalTheme";
import { useTerminalTheme } from "./useTerminalTheme";

function openTerminal() {
	return {
		current: { term: { options: {} } } as unknown as TerminalHandle,
	};
}

describe("useTerminalTheme", () => {
	it("switches an open terminal's theme when the mode toggles", () => {
		const handleRef = openTerminal();
		const { rerender } = renderHook(
			({ mode }) => useTerminalTheme(handleRef, mode),
			{ initialProps: { mode: "dark" as "dark" | "light" } },
		);
		expect(handleRef.current.term.options.theme).toBe(terminalTheme("dark"));

		rerender({ mode: "light" });

		expect(handleRef.current.term.options.theme).toBe(terminalTheme("light"));
		expect(terminalTheme("light").background).not.toBe(
			terminalTheme("dark").background,
		);
	});
});
