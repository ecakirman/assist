// @vitest-environment jsdom
import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { makeSessionInfo } from "../../../../../../../../../../test/mothers/makeSessionInfo";
import { renderWithTheme } from "../../../../../../../../../../test/renderWithTheme";
import type { SessionStatus } from "../../../../../../types";
import { CardBadges } from "./CardBadges";

afterEach(cleanup);

function renderReview(status: SessionStatus) {
	renderWithTheme(
		<CardBadges
			session={makeSessionInfo({
				status,
				activity: {
					kind: "backlog",
					startedAt: 0,
					phase: 3,
					totalPhases: 3,
				},
			})}
		/>,
		{ mode: "dark" },
	);
	return getComputedStyle(screen.getByText("3/3"));
}

describe("CardBadges", () => {
	it("outlines the final-phase badge while the review runs", () => {
		expect(renderReview("running").backgroundColor).toBe("rgba(0, 0, 0, 0)");
	});

	it("fills the final-phase badge once the review is done", () => {
		expect(renderReview("done").backgroundColor).toBe("rgb(139, 156, 255)");
	});
});
