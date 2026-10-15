// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { HighLevelStructureView } from "./HighLevelStructureView";
import { highLevelTreeFixture } from "./highLevelTreeFixture";

beforeEach(() => localStorage.clear());
afterEach(cleanup);

function renderView(collapsedPaths: string[] = []) {
	return render(
		<HighLevelStructureView
			subject="structure-inline-test"
			collapsedPaths={collapsedPaths}
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

	it("colours the status letter and line counts", () => {
		renderView();
		const row = fileRow("README.md");
		const colourOf = (text: string) =>
			getComputedStyle(
				[...row.querySelectorAll("span")].find(
					(span) => span.textContent === text,
				) as HTMLElement,
			).color;

		expect(colourOf("M")).toBe("rgb(237, 108, 2)");
		expect(colourOf("+1")).toBe("rgb(46, 125, 50)");
		expect(colourOf("−1")).toBe("rgb(211, 47, 47)");
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

	it("toggles from anywhere on the row but not from its GitHub link", () => {
		const { container } = renderView();
		const line = fileRow("README.md").parentElement as HTMLElement;

		fireEvent.click(screen.getByLabelText("Open README.md on GitHub"));
		expect(diffCount(container)).toBe(3);

		fireEvent.click(line);
		expect(fileRow("README.md").getAttribute("aria-expanded")).toBe("false");
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

const GLOB_TAG_TITLE = "Collapsed by review.highLevel.collapsedPaths";

describe("HighLevelStructureView collapsedPaths defaults", () => {
	it("starts matching files collapsed, marked ignored with their glob", () => {
		const { container } = renderView(["**/*.md"]);

		expect(fileRow("README.md").getAttribute("aria-expanded")).toBe("false");
		expect(screen.getByTitle(GLOB_TAG_TITLE).textContent).toBe(
			"ignored**/*.md",
		);
		expect(fileRow("src/app.ts").getAttribute("aria-expanded")).toBe("true");
		expect(diffCount(container)).toBe(2);
	});

	it("drops the glob tag once a matching file is opened", () => {
		renderView(["**/*.md"]);

		fireEvent.click(fileRow("README.md"));

		expect(fileRow("README.md").getAttribute("aria-expanded")).toBe("true");
		expect(screen.queryByTitle(GLOB_TAG_TITLE)).toBeNull();
	});

	it("starts a directory collapsed and ignored when all its files match", () => {
		renderView(["src/lib/**"]);

		expect(
			screen
				.getByRole("button", { name: "src/lib" })
				.getAttribute("aria-expanded"),
		).toBe("false");
		expect(screen.getByTitle(GLOB_TAG_TITLE).textContent).toBe(
			"1 ignoredsrc/lib/**",
		);
		expect(screen.queryByText(/hidden/)).toBeNull();
		expect(
			screen.getByRole("button", { name: "src" }).getAttribute("aria-expanded"),
		).toBe("true");
	});

	it("offers each collapsedPaths glob as a quick chip beside **/*.md", () => {
		renderView(["**/*.test.*"]);

		expect(screen.getByRole("button", { name: "**/*.md" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "**/*.test.*" })).toBeTruthy();
	});

	it("remembers opening a file that started collapsed", () => {
		const first = renderView(["**/*.md"]);
		fireEvent.click(fileRow("README.md"));
		first.unmount();

		renderView(["**/*.md"]);

		expect(fileRow("README.md").getAttribute("aria-expanded")).toBe("true");
	});
});

function button(name: string | RegExp) {
	return screen.getByRole("button", { name }) as HTMLButtonElement;
}

function matchGlob(glob: string) {
	fireEvent.change(screen.getByLabelText("Match changed files"), {
		target: { value: glob },
	});
}

describe("HighLevelStructureView toolbar", () => {
	it("collapses every diff and expands every folder and diff", () => {
		const { container } = renderView();
		fireEvent.click(button("src"));

		fireEvent.click(button("Collapse all"));
		expect(diffCount(container)).toBe(0);

		fireEvent.click(button("Expand all"));
		expect(button("src").getAttribute("aria-expanded")).toBe("true");
		expect(diffCount(container)).toBe(3);
	});

	it("marks rows matching the glob and counts them", () => {
		renderView();

		matchGlob("src/**");

		expect(screen.getByText("2 files")).toBeTruthy();
		expect(
			fileRow("src/app.ts").parentElement?.hasAttribute("data-matched"),
		).toBe(true);
		expect(
			fileRow("README.md").parentElement?.hasAttribute("data-matched"),
		).toBe(false);
	});

	it("disables Show and Hide until something matches", () => {
		renderView();
		expect(button("Show").disabled).toBe(true);

		matchGlob("*.nothing");
		expect(button("Hide").disabled).toBe(true);

		matchGlob("*.md");
		expect(button("Hide").disabled).toBe(false);
	});

	it("hides the matching diffs and shows them again with their folders", () => {
		const { container } = renderView();
		fireEvent.click(button("src/lib"));
		fireEvent.click(button("src"));

		fireEvent.click(button("**/*.md"));
		fireEvent.click(button("Hide"));
		expect(fileRow("README.md").getAttribute("aria-expanded")).toBe("false");

		matchGlob("src/lib/**");
		expect(button("src").hasAttribute("data-matched")).toBe(true);
		fireEvent.click(button("Show"));
		expect(button("src").getAttribute("aria-expanded")).toBe("true");
		expect(button("src/lib").getAttribute("aria-expanded")).toBe("true");
		expect(diffCount(container)).toBe(2);
	});

	it("counts changes from the defaults and resets to them", () => {
		const { container } = renderView(["**/*.md"]);
		expect(button("Defaults").disabled).toBe(true);

		fireEvent.click(button("Expand all"));
		fireEvent.click(button("src"));
		fireEvent.click(button("Reset 2 changes"));

		expect(button("Defaults").disabled).toBe(true);
		expect(button("src").getAttribute("aria-expanded")).toBe("true");
		expect(fileRow("README.md").getAttribute("aria-expanded")).toBe("false");
		expect(diffCount(container)).toBe(2);
	});

	it("remembers bulk changes for the subject across remounts", () => {
		const first = renderView();
		fireEvent.click(button("Collapse all"));
		first.unmount();

		const { container } = renderView();

		expect(diffCount(container)).toBe(0);
		expect(button("Reset 3 changes").disabled).toBe(false);
	});
});
