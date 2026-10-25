import { describe, expect, it } from "vitest";
import { docsPageSchema } from "./docsPageSchema";

const screenshot = {
	file: "sessions-dashboard.png",
	alt: "The sessions dashboard",
	route: "/sessions",
	viewport: { width: 1280, height: 800 },
	theme: "dark",
	waitFor: "[data-testid=session-card]",
};

const validPage = {
	id: "getting-started",
	title: "Getting started",
	group: "Getting started",
	order: 0,
	covers: ["cli:update"],
	screenshots: [screenshot],
};

function withScreenshot(extra: Record<string, unknown>) {
	return { ...validPage, screenshots: [{ ...screenshot, ...extra }] };
}

describe("docsPageSchema", () => {
	it("accepts a valid page, with or without screenshots", () => {
		expect(docsPageSchema.safeParse(validPage).success).toBe(true);
		const { screenshots: _screenshots, ...withoutScreenshots } = validPage;
		expect(docsPageSchema.safeParse(withoutScreenshots).success).toBe(true);
	});

	it("rejects an unknown top-level key", () => {
		expect(
			docsPageSchema.safeParse({ ...validPage, summary: "extra" }).success,
		).toBe(false);
	});

	it("rejects an unknown key on a screenshot", () => {
		expect(docsPageSchema.safeParse(withScreenshot({ zoom: 2 })).success).toBe(
			false,
		);
	});

	it.each([
		[[{ assist: ["backlog", "list"] }, { run: "dev" }], true],
		[[{ assist: [] }], false],
		[[{ run: "dev", assist: ["x"] }], false],
		[[{ click: "#add" }], false],
		[
			[
				{
					session: {
						repo: "api",
						prompt: "Add pagination",
						title: "Paginate",
						status: "waiting",
						reply: ["Done."],
					},
				},
			],
			true,
		],
		[[{ session: { repo: "elsewhere", prompt: "x" } }], false],
		[[{ session: { repo: "api", prompt: "x", status: "error" } }], false],
	])("validates setup steps %j", (setup, valid) => {
		expect(docsPageSchema.safeParse(withScreenshot({ setup })).success).toBe(
			valid,
		);
	});

	it.each([
		[[{ click: "text=Dark mode toggle" }, { press: "Escape" }], true],
		[[{ hover: "#add" }], false],
		[[{ click: "#add", press: "Enter" }], false],
	])("validates actions %j", (actions, valid) => {
		expect(
			docsPageSchema.safeParse(withScreenshot({ scene: "dashboard", actions }))
				.success,
		).toBe(valid);
	});

	it("rejects a nav group that is not declared", () => {
		expect(
			docsPageSchema.safeParse({ ...validPage, group: "Misc" }).success,
		).toBe(false);
	});

	it("requires covers", () => {
		const { covers: _covers, ...withoutCovers } = validPage;
		expect(docsPageSchema.safeParse(withoutCovers).success).toBe(false);
	});

	it("rejects a non-kebab id and a non-png screenshot file", () => {
		expect(
			docsPageSchema.safeParse({ ...validPage, id: "Getting Started" }).success,
		).toBe(false);
		expect(
			docsPageSchema.safeParse(withScreenshot({ file: "shot.jpg" })).success,
		).toBe(false);
	});
});
