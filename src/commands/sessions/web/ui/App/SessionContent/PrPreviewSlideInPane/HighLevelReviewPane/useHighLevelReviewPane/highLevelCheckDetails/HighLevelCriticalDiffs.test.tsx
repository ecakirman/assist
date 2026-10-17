// @vitest-environment jsdom
import {
	cleanup,
	fireEvent,
	render,
	screen,
	within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { HighLevelCriticalDiff } from "../../../../../../../../../review/highLevel/types";
import { describeHeaderClicks } from "../../../describeHeaderClicks";
import { HighLevelCriticalDiffs } from "./HighLevelCriticalDiffs";

beforeEach(() => localStorage.clear());
afterEach(cleanup);

function criticalDiff(path: string): HighLevelCriticalDiff {
	return {
		path,
		status: "modified",
		additions: 1,
		deletions: 1,
		diffUrl: `https://github.com/o/r/pull/1/files#${path}`,
		patch: `@@ -1 +1 @@\n-was\n+now`,
	};
}

function renderDiffs() {
	return render(
		<HighLevelCriticalDiffs
			diffs={[criticalDiff("a.graphql"), criticalDiff("b.graphql")]}
			criticalPaths={["**/*.graphql"]}
			subject="critical-bulk-test"
		/>,
	);
}

function bulkState(label: "Expand all" | "Collapse all") {
	const el = screen.getByRole("button", {
		name: new RegExp(`^${label}`),
	}) as HTMLButtonElement;
	return {
		count: Number(within(el).getByTestId("bulk-count").textContent),
		disabled: el.disabled,
	};
}

function bulkCounts() {
	return {
		expand: bulkState("Expand all"),
		collapse: bulkState("Collapse all"),
	};
}

describe("HighLevelCriticalDiffs bulk buttons", () => {
	it("badges and toggles the critical diffs", () => {
		const { container } = renderDiffs();
		expect(bulkCounts()).toEqual({
			expand: { count: 0, disabled: true },
			collapse: { count: 2, disabled: false },
		});

		fireEvent.click(screen.getByRole("button", { name: "Collapse a.graphql" }));
		expect(bulkCounts()).toEqual({
			expand: { count: 1, disabled: false },
			collapse: { count: 1, disabled: false },
		});

		fireEvent.click(screen.getByRole("button", { name: /^Collapse all/ }));
		expect(container.querySelectorAll("table.diff").length).toBe(0);
		expect(bulkCounts()).toEqual({
			expand: { count: 2, disabled: false },
			collapse: { count: 0, disabled: true },
		});

		fireEvent.click(screen.getByRole("button", { name: /^Expand all/ }));
		expect(container.querySelectorAll("table.diff").length).toBe(2);
		expect(bulkCounts()).toEqual({
			expand: { count: 0, disabled: true },
			collapse: { count: 2, disabled: false },
		});
	});
});

describeHeaderClicks("HighLevelCriticalDiffs", () => {
	renderDiffs();
});
