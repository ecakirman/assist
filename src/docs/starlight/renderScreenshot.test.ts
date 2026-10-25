import { describe, expect, it } from "vitest";
import { renderScreenshot } from "./renderScreenshot";

describe("renderScreenshot", () => {
	it("renders light and dark images hidden in the other theme", () => {
		expect(
			renderScreenshot(
				{ file: "dash.png", alt: 'The "dashboard"', route: "/sessions" },
				"/assist/",
			),
		).toBe(
			'<figure><img src="/assist/screenshots/dash.png" alt="The &quot;dashboard&quot;" loading="lazy" class="dark:sl-hidden"><img src="/assist/screenshots/dash-dark.png" alt="The &quot;dashboard&quot;" loading="lazy" class="light:sl-hidden"><figcaption>The &quot;dashboard&quot;</figcaption></figure>',
		);
	});

	it("renders a themed screenshot as a single image", () => {
		expect(
			renderScreenshot(
				{ file: "a.png", alt: "A", route: "/sessions", theme: "dark" },
				"/",
			),
		).toBe(
			'<figure><img src="/screenshots/a.png" alt="A" loading="lazy"><figcaption>A</figcaption></figure>',
		);
	});
});
