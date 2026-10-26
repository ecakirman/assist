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
			'<figure><a href="/assist/screenshots/dash.png" target="_blank" title="Open full size" class="dark:sl-hidden"><img src="/assist/screenshots/dash.png" alt="The &quot;dashboard&quot;" loading="lazy"></a><a href="/assist/screenshots/dash-dark.png" target="_blank" title="Open full size" class="light:sl-hidden"><img src="/assist/screenshots/dash-dark.png" alt="The &quot;dashboard&quot;" loading="lazy"></a><figcaption>The &quot;dashboard&quot;</figcaption></figure>',
		);
	});

	it("renders a themed screenshot as a single image", () => {
		expect(
			renderScreenshot(
				{ file: "a.png", alt: "A", route: "/sessions", theme: "dark" },
				"/",
			),
		).toBe(
			'<figure><a href="/screenshots/a.png" target="_blank" title="Open full size"><img src="/screenshots/a.png" alt="A" loading="lazy"></a><figcaption>A</figcaption></figure>',
		);
	});
});
