// @vitest-environment jsdom
import { cleanup, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithTheme as render } from "../../../../../../../test/renderWithTheme";
import { RateLimitsIndicator } from "./RateLimitsIndicator";

const NOW = 1_700_000_000;

beforeEach(() => vi.useFakeTimers({ now: NOW * 1000 }));

afterEach(() => {
	cleanup();
	vi.useRealTimers();
});

const claude = { five_hour: { used_percentage: 12, resets_at: NOW + 3600 } };
const codex = { seven_day: { used_percentage: 34, resets_at: NOW + 86400 } };
const matching = {
	five_hour: { used_percentage: 42, resets_at: NOW + 3 * 3600 + 10 * 60 },
	seven_day: { used_percentage: 42, resets_at: NOW + 3 * 86400 + 10 * 3600 },
};

function renderIndicator(props: Parameters<typeof RateLimitsIndicator>[0]) {
	return render(
		<MemoryRouter>
			<RateLimitsIndicator {...props} />
		</MemoryRouter>,
	);
}

describe("RateLimitsIndicator", () => {
	it("shows Claude's chips without a harness label when only Claude reports", () => {
		renderIndicator({ rateLimits: claude });

		expect(screen.getByRole("link").textContent).toBe("12% (1h 0m)");
	});

	it("labels each harness when Codex reports alongside Claude", () => {
		renderIndicator({ rateLimits: claude, harnessRateLimits: { codex } });

		expect(screen.getByRole("link").textContent).toBe(
			"Claude12% (1h 0m)Codex34% (1d 0h)",
		);
	});

	it("shows Codex usage on its own when Claude has reported nothing", () => {
		renderIndicator({ rateLimits: null, harnessRateLimits: { codex } });

		expect(screen.getByRole("link").textContent).toBe("Codex34% (1d 0h)");
	});

	it("wraps both windows in a rainbow pill when their numbers match", () => {
		renderIndicator({ rateLimits: matching });

		const pill = screen.getByTestId("rainbow-pill");
		expect(pill.textContent).toBe("42% (3h 10m),42% (3d 10h)");
	});

	it("renders no pill when the windows read different numbers", () => {
		renderIndicator({
			rateLimits: {
				five_hour: matching.five_hour,
				seven_day: {
					used_percentage: 61,
					resets_at: matching.seven_day.resets_at,
				},
			},
		});

		expect(screen.queryByTestId("rainbow-pill")).toBeNull();
	});

	it("renders no pill for a single window", () => {
		renderIndicator({ rateLimits: claude });

		expect(screen.queryByTestId("rainbow-pill")).toBeNull();
	});

	it("gives each harness group its own pill", () => {
		renderIndicator({
			rateLimits: matching,
			harnessRateLimits: {
				codex: {
					...codex,
					five_hour: { used_percentage: 8, resets_at: NOW + 600 },
				},
			},
		});

		const pills = screen.getAllByTestId("rainbow-pill");
		expect(pills.map((p) => p.textContent)).toEqual([
			"42% (3h 10m),42% (3d 10h)",
		]);
	});

	it("falls back to the Usage link when nothing has reported", () => {
		renderIndicator({ rateLimits: null });

		expect(screen.getByRole("link").textContent).toBe("Usage");
	});
});
