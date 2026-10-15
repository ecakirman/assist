// @vitest-environment jsdom
import {
	cleanup,
	fireEvent,
	render,
	screen,
	within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { HighLevelCheckResult } from "../../../../../../../review/highLevel/types";
import { HighLevelChecklistBody } from "./HighLevelChecklistBody";
import { highLevelCheckDomId } from "./HighLevelChecklistBody/highLevelCheckDomId";
import { useHighLevelChecklist } from "./useHighLevelChecklist";

const deterministic: HighLevelCheckResult = {
	id: "description-what-why",
	kind: "deterministic",
	title: "Description has a What and a Why",
	backing: "The PR body",
	status: "pass",
	reason: "has both",
};

function manual(
	id: "structure-sensible" | "critical-diffs-correct" | "tests-worth-having",
	title: string,
	short: string,
): HighLevelCheckResult {
	return {
		id,
		kind: "manual",
		title,
		short,
		backing: title,
		status: "manual",
		reason: title,
	};
}

const manualChecks = [
	manual("structure-sensible", "The structure is sensible", "Structure"),
	manual(
		"critical-diffs-correct",
		"The critical diffs are correct",
		"Critical diffs",
	),
	manual("tests-worth-having", "The tests are worth having", "Tests"),
];

function Body({ checks }: { checks: HighLevelCheckResult[] }) {
	const checklist = useHighLevelChecklist(checks);
	return (
		<HighLevelChecklistBody
			checks={checks}
			checklist={checklist}
			details={{}}
		/>
	);
}

function strip() {
	return screen.getByRole("navigation", { name: "Judge" });
}

function jumps() {
	return within(strip()).getAllByRole("button");
}

function setTop(el: HTMLElement, top: number) {
	el.getBoundingClientRect = () => ({ top }) as DOMRect;
}

afterEach(() => {
	cleanup();
	Reflect.deleteProperty(Element.prototype, "scrollIntoView");
});

describe("HighLevelChecklistBody jump strip", () => {
	it("has one jump per manual check, in checklist order", () => {
		render(<Body checks={[deterministic, ...manualChecks]} />);

		expect(jumps().map((jump) => jump.textContent)).toEqual([
			"Structure",
			"Critical diffs",
			"Tests",
		]);
	});

	it("is not rendered without manual checks", () => {
		render(<Body checks={[deterministic]} />);

		expect(screen.queryByRole("navigation", { name: "Judge" })).toBeNull();
	});

	it("labels a jump ticked once its check is ticked", () => {
		render(<Body checks={manualChecks} />);

		expect(
			within(strip()).getByRole("button", { name: "Tests, not ticked" }),
		).toBeTruthy();
		fireEvent.click(screen.getByLabelText("The tests are worth having"));
		expect(
			within(strip()).getByRole("button", { name: "Tests, ticked" }),
		).toBeTruthy();
	});

	it("scrolls to the check and focuses its checkbox on click", () => {
		const scrollIntoView = vi.fn();
		Element.prototype.scrollIntoView = scrollIntoView;
		render(<Body checks={manualChecks} />);

		fireEvent.click(
			within(strip()).getByRole("button", { name: "Tests, not ticked" }),
		);

		expect(scrollIntoView).toHaveBeenCalledWith(
			expect.objectContaining({ block: "start" }),
		);
		expect(scrollIntoView.mock.contexts[0]).toBe(
			document.getElementById(highLevelCheckDomId("tests-worth-having")),
		);
		expect(document.activeElement).toBe(
			screen.getByLabelText("The tests are worth having"),
		);
	});

	it("marks the check in view as current while scrolling", () => {
		render(<Body checks={manualChecks} />);
		const container = strip().parentElement as HTMLElement;
		setTop(container, 0);
		const rows = manualChecks.map(
			(check) =>
				document.getElementById(highLevelCheckDomId(check.id)) as HTMLElement,
		);

		rows.forEach((row, i) => setTop(row, [-300, 48, 600][i] ?? 0));
		fireEvent.scroll(container);

		expect(jumps().map((jump) => jump.getAttribute("aria-current"))).toEqual([
			null,
			"true",
			null,
		]);
	});

	it("marks the last check current when scrolled to the bottom", () => {
		render(<Body checks={manualChecks} />);
		const container = strip().parentElement as HTMLElement;
		Object.defineProperties(container, {
			scrollHeight: { value: 1000 },
			clientHeight: { value: 400 },
			scrollTop: { value: 600 },
		});

		fireEvent.scroll(container);

		expect(jumps()[2]?.getAttribute("aria-current")).toBe("true");
	});
});
