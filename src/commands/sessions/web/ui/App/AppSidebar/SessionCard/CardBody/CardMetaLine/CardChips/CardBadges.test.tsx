// @vitest-environment jsdom
import { cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { makeSessionInfo } from "../../../../../../../../../../test/mothers/makeSessionInfo";
import { renderWithTheme } from "../../../../../../../../../../test/renderWithTheme";
import { CardBadges } from "./CardBadges";

afterEach(cleanup);

describe("CardBadges", () => {
	it("fills the final-phase badge", () => {
		renderWithTheme(
			<CardBadges
				session={makeSessionInfo({
					status: "waiting",
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

		expect(getComputedStyle(screen.getByText("3/3")).backgroundColor).toBe(
			"rgb(139, 156, 255)",
		);
	});
});
