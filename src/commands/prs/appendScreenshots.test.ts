import { describe, expect, it } from "vitest";
import { appendScreenshots } from "./appendScreenshots";

describe("appendScreenshots", () => {
	it("returns the body unchanged when there are no screenshots", () => {
		expect(appendScreenshots("body", [])).toBe("body");
	});

	it("renders ungrouped images as plain images", () => {
		expect(
			appendScreenshots("body", [
				{ path: "/s/a.png", alt: "a" },
				{ path: "/s/b.png", alt: "b" },
			]),
		).toBe("body\n\n## Screenshots\n\n![a](/s/a.png)\n\n![b](/s/b.png)");
	});

	it("renders a group as a 2-column captioned table", () => {
		expect(
			appendScreenshots("body", [
				{ path: "/s/a.png", alt: "a", group: "G" },
				{ path: "/s/b.png", alt: "b", group: "G" },
			]),
		).toBe(
			"body\n\n## Screenshots\n\n### G\n\n| a | b |\n| --- | --- |\n| ![a](/s/a.png) | ![b](/s/b.png) |",
		);
	});

	it("renders each group under a ### heading before the ungrouped images", () => {
		expect(
			appendScreenshots("body", [
				{ path: "/s/drop.png", alt: "drop" },
				{ path: "/s/l.png", alt: "light", group: "Profile" },
				{ path: "/s/d.png", alt: "dark", group: "Profile" },
				{ path: "/s/h.png", alt: "home", group: "Home" },
			]),
		).toBe(
			[
				"body",
				"## Screenshots",
				"### Profile",
				"| light | dark |\n| --- | --- |\n| ![light](/s/l.png) | ![dark](/s/d.png) |",
				"### Home",
				"| home |  |\n| --- | --- |\n| ![home](/s/h.png) |  |",
				"![drop](/s/drop.png)",
			].join("\n\n"),
		);
	});

	it("bolds the captions of rows after the first", () => {
		const body = appendScreenshots(
			"body",
			["a", "b", "c"].map((alt) => ({
				path: `/s/${alt}.png`,
				alt,
				group: "G",
			})),
		);
		expect(body).toContain(
			"| ![a](/s/a.png) | ![b](/s/b.png) |\n| **c** |  |\n| ![c](/s/c.png) |  |",
		);
	});

	it("keeps videos out of the table", () => {
		expect(
			appendScreenshots("body", [
				{ path: "/s/a.png", alt: "a", group: "G" },
				{ path: "/s/v.mp4", alt: "v", group: "G" },
			]),
		).toBe(
			"body\n\n## Screenshots\n\n### G\n\n| a |  |\n| --- | --- |\n| ![a](/s/a.png) |  |\n\n![v](/s/v.mp4)",
		);
	});

	it("escapes pipes in captions and wraps paths containing spaces", () => {
		expect(
			appendScreenshots("body", [
				{ path: "C:/Users/A B/a.png", alt: "x|y", group: "G" },
			]),
		).toContain(String.raw`| ![x\|y](<C:/Users/A B/a.png>) |`);
	});

	it("replaces an existing ## Screenshots section", () => {
		const existing =
			"## What\n\nw\n\n## Screenshots\n\n### Old\n\n![o](https://x/o.png)\n\n## Notes\n\nn";
		expect(appendScreenshots(existing, [{ path: "/s/a.png", alt: "a" }])).toBe(
			"## What\n\nw\n\n## Notes\n\nn\n\n## Screenshots\n\n![a](/s/a.png)",
		);
	});
});
