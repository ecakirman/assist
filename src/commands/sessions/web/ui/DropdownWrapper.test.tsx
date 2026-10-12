// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { DropdownWrapper } from "./DropdownWrapper";
import { RepoList } from "./RepoList";

beforeAll(() => {
	Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
	cleanup();
});

const repos = ["/repos/alpha", "/repos/beta", "/repos/gamma"];

function renderPicker(typeToOpen = true) {
	render(
		<DropdownWrapper label="Select repo..." typeToOpen={typeToOpen}>
			{(close, initialFilter) => (
				<RepoList
					repos={repos}
					selected=""
					onSelect={vi.fn()}
					close={close}
					initialFilter={initialFilter}
				/>
			)}
		</DropdownWrapper>,
	);
	const trigger = screen.getByRole("button", { name: "Select repo..." });
	trigger.focus();
	return trigger;
}

const filterInput = () => screen.queryByPlaceholderText("Filter repos...");

describe("DropdownWrapper type-to-open", () => {
	it("typing on the trigger opens the list filtered by that character", () => {
		const trigger = renderPicker();
		fireEvent.keyDown(trigger, { key: "g" });
		const input = filterInput() as HTMLInputElement;
		expect(input.value).toBe("g");
		expect(document.activeElement).toBe(input);
		expect(screen.getByText("gamma")).toBeTruthy();
		expect(screen.queryByText("beta")).toBeNull();
	});

	it.each([
		{ key: "r", altKey: true },
		{ key: "k", ctrlKey: true },
		{ key: "k", metaKey: true },
		{ key: "Tab" },
		{ key: "ArrowDown" },
		{ key: "Enter" },
		{ key: " " },
	])("does not open on %o", (init) => {
		const trigger = renderPicker();
		fireEvent.keyDown(trigger, init);
		expect(filterInput()).toBeNull();
	});

	it("does not open without the opt-in", () => {
		const trigger = renderPicker(false);
		fireEvent.keyDown(trigger, { key: "g" });
		expect(filterInput()).toBeNull();
	});

	it("clicking the trigger opens with an empty filter", () => {
		const trigger = renderPicker();
		fireEvent.click(trigger);
		expect((filterInput() as HTMLInputElement).value).toBe("");
	});
});
