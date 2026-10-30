// @vitest-environment jsdom
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createDesignTheme } from "../../../../../../../../designSystem/createDesignTheme";
import type { TerminalHandle } from "../createTerminal";
import { terminalTheme } from "../terminalTheme";
import { useTerminalTheme } from "./useTerminalTheme";

function openTerminal() {
	return {
		current: { term: { options: {} } } as unknown as TerminalHandle,
	};
}

const lookOf = (mode: "dark" | "light") =>
	terminalTheme(createDesignTheme(mode).tokens);

describe("useTerminalTheme", () => {
	it("switches an open terminal's theme when the mode toggles", () => {
		const handleRef = openTerminal();
		const { rerender } = renderHook(
			({ look }) => useTerminalTheme(handleRef, look),
			{ initialProps: { look: lookOf("dark") } },
		);
		expect(handleRef.current.term.options).toMatchObject(lookOf("dark"));

		rerender({ look: lookOf("light") });

		const light = lookOf("light");
		expect(handleRef.current.term.options).toMatchObject(light);
		expect(light.theme.background).not.toBe(lookOf("dark").theme.background);
	});
});
