// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { HighLevelStructureView } from "./HighLevelStructureView";
import { highLevelTreeFixture } from "../highLevelTreeFixture";

beforeEach(() => localStorage.clear());
afterEach(cleanup);

function renderView() {
	return render(
		<HighLevelStructureView
			subject="structure-inline-test"
			structure={{
				tree: highLevelTreeFixture,
				added: 0,
				removed: 0,
				modified: 3,
				additions: 3,
				deletions: 3,
			}}
		/>,
	);
}

function fileRow(path: string) {
	return screen.getByRole("button", {
		name: new RegExp(`^(Expand|Collapse) ${path}$`),
	});
}

function diffCount(container: HTMLElement) {
	return container.querySelectorAll("table.diff").length;
}

describe("HighLevelStructureView tree", () => {
	it("renders inline without a nested scroll box", () => {
		renderView();
		const wrapper = fileRow("README.md").parentElement as HTMLElement;
		const style = getComputedStyle(wrapper);

		expect(style.maxHeight).toBe("none");
		expect(style.overflowY).toBe("visible");
	});

	it("shows how many files a collapsed directory hides", () => {
		renderView();
		const src = screen.getByRole("button", { name: "src" });

		fireEvent.click(src);

		expect(src.getAttribute("aria-expanded")).toBe("false");
		expect(screen.getByText("2 files hidden")).toBeTruthy();
		expect(screen.queryByRole("button", { name: /src\/app\.ts/ })).toBeNull();
	});
});

describe("HighLevelStructureView inline diffs", () => {
	it("starts with every file's diff open under its row", () => {
		const { container } = renderView();

		for (const path of ["src/lib/util.ts", "src/app.ts", "README.md"])
			expect(fileRow(path).getAttribute("aria-expanded")).toBe("true");
		expect(diffCount(container)).toBe(3);
	});

	it("toggles a file's diff inline without opening a dialog", () => {
		const { container } = renderView();

		fireEvent.click(fileRow("src/app.ts"));
		expect(fileRow("src/app.ts").getAttribute("aria-expanded")).toBe("false");
		expect(diffCount(container)).toBe(2);
		expect(screen.queryByRole("dialog")).toBeNull();

		fireEvent.click(fileRow("src/app.ts"));
		expect(diffCount(container)).toBe(3);
	});

	it("renders the diff beside the row, not inside its indented button", () => {
		renderView();
		const row = fileRow("src/lib/util.ts");

		const line = row.parentElement as HTMLElement;

		expect(line.querySelector("table.diff")).toBeNull();
		expect(line.nextElementSibling?.querySelector("table.diff")).not.toBeNull();
	});

	it("remembers collapsed files for the subject across remounts", () => {
		const first = renderView();
		fireEvent.click(fileRow("README.md"));
		first.unmount();

		const { container } = renderView();

		expect(fileRow("README.md").getAttribute("aria-expanded")).toBe("false");
		expect(diffCount(container)).toBe(2);
	});
});
