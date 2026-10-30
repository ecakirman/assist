// @vitest-environment jsdom
import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { renderWithTheme as render } from "../../../../../test/renderWithTheme";
import type { PhaseSession, PlanPhase } from "../types";
import { PlanSection } from "./PlanSection";

afterEach(cleanup);

const phaseNumberOf = (name: string) =>
	screen.getByText(name).previousSibling?.textContent;

const phases: PlanPhase[] = [
	{ name: "First", tasks: [{ task: "do a" }] },
	{ name: "Second", tasks: [{ task: "do b" }] },
];

describe("PlanSection", () => {
	it("renders no Sessions label when a phase has none", () => {
		render(<PlanSection phases={phases} />);

		expect(screen.queryByText("Sessions")).toBeNull();
	});

	it("renders machine, user, and session id under the phase that ran", () => {
		const sessions: PhaseSession[] = [
			{
				phaseIdx: 0,
				claudeSessionId: "sess-a",
				hostname: "host-1",
				osUser: "alice",
			},
		];

		render(<PlanSection phases={phases} sessions={sessions} />);

		expect(screen.getByText("host-1 / alice / sess-a")).toBeTruthy();
	});

	it("renders review-phase sessions under a synthetic Review card", () => {
		const sessions: PhaseSession[] = [
			{
				phaseIdx: 2,
				claudeSessionId: "sess-review",
				hostname: "host-r",
				osUser: "carol",
			},
		];

		render(
			<PlanSection phases={phases} currentPhase={3} sessions={sessions} />,
		);

		expect(phaseNumberOf("Review")).toBe("3");
		expect(screen.getByText("host-r / carol / sess-review")).toBeTruthy();
	});

	it("renders one Review card when the plan already ends with a Review phase", () => {
		const authoredReview: PlanPhase[] = [
			{ name: "First", tasks: [{ task: "do a" }] },
			{ name: "Review", tasks: [{ task: "check it" }] },
		];
		const sessions: PhaseSession[] = [
			{
				phaseIdx: 2,
				claudeSessionId: "sess-review",
				hostname: "host-r",
				osUser: "carol",
			},
		];

		render(
			<PlanSection
				phases={authoredReview}
				currentPhase={2}
				sessions={sessions}
			/>,
		);

		expect(screen.getAllByText(/Review$/)).toHaveLength(1);
		expect(phaseNumberOf("Review")).toBe("2");
		expect(screen.getByText("host-r / carol / sess-review")).toBeTruthy();
	});
});
