// @vitest-environment jsdom
import { act, cleanup, fireEvent, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { renderWithTheme } from "../../../../../../../../test/renderWithTheme";
import { defaultHotkeys } from "../../../../../../../../shared/hotkeys/defaultHotkeys";
import { hotkeyBindingsStore } from "../../../hotkeyBindingsStore";
import { VersionBadge } from "./VersionBadge";

function renderBadge() {
	return renderWithTheme(
		<MemoryRouter initialEntries={["/sessions"]}>
			<VersionBadge />
			<Routes>
				<Route path="/updates" element={<div>updates page</div>} />
				<Route path="/sessions" element={<div>sessions page</div>} />
			</Routes>
		</MemoryRouter>,
	);
}

afterEach(cleanup);

describe("VersionBadge", () => {
	it("navigates to the updates page on Alt+Q", () => {
		renderBadge();

		fireEvent.keyDown(document.body, { code: "KeyQ", altKey: true });

		expect(screen.getByText("updates page")).toBeTruthy();
	});

	it("follows a remapped updates chord", () => {
		renderBadge();
		act(() =>
			hotkeyBindingsStore.set({
				...defaultHotkeys,
				openUpdates: ["Ctrl+Alt+U"],
			}),
		);

		try {
			fireEvent.keyDown(document.body, { code: "KeyQ", altKey: true });
			expect(screen.queryByText("updates page")).toBeNull();

			fireEvent.keyDown(document.body, {
				code: "KeyU",
				ctrlKey: true,
				altKey: true,
			});
			expect(screen.getByText("updates page")).toBeTruthy();
		} finally {
			hotkeyBindingsStore.set(defaultHotkeys);
		}
	});
});
