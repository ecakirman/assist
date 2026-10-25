import { describe, expect, it } from "vitest";
import { docsPageSchema } from "./docsPageSchema";

const validPage = {
	id: "getting-started",
	title: "Getting started",
	group: "Getting started",
	order: 0,
	covers: ["cli:update"],
	sections: [
		{
			heading: "Install",
			markdown: "Run `npm i -g @staff0rd/assist`.",
			screenshots: [
				{
					file: "sessions-dashboard.png",
					alt: "The sessions dashboard",
					route: "/sessions",
					viewport: { width: 1280, height: 800 },
					theme: "dark",
					waitFor: "[data-testid=session-card]",
				},
			],
		},
	],
};

describe("docsPageSchema", () => {
	it("accepts a valid page", () => {
		expect(docsPageSchema.safeParse(validPage).success).toBe(true);
	});

	it("rejects an unknown top-level key", () => {
		expect(
			docsPageSchema.safeParse({ ...validPage, summary: "extra" }).success,
		).toBe(false);
	});

	it("rejects an unknown key on a section", () => {
		const section = { ...validPage.sections[0], body: "extra" };
		expect(
			docsPageSchema.safeParse({ ...validPage, sections: [section] }).success,
		).toBe(false);
	});

	it("rejects an unknown key on a screenshot", () => {
		const screenshot = { ...validPage.sections[0].screenshots[0], zoom: 2 };
		const section = { ...validPage.sections[0], screenshots: [screenshot] };
		expect(
			docsPageSchema.safeParse({ ...validPage, sections: [section] }).success,
		).toBe(false);
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
		const screenshot = { ...validPage.sections[0].screenshots[0], setup };
		const section = { ...validPage.sections[0], screenshots: [screenshot] };
		expect(
			docsPageSchema.safeParse({ ...validPage, sections: [section] }).success,
		).toBe(valid);
	});

	it.each([
		[[{ click: "text=Dark mode toggle" }, { press: "Escape" }], true],
		[[{ hover: "#add" }], false],
		[[{ click: "#add", press: "Enter" }], false],
	])("validates actions %j", (actions, valid) => {
		const screenshot = {
			...validPage.sections[0].screenshots[0],
			scene: "dashboard",
			actions,
		};
		const section = { ...validPage.sections[0], screenshots: [screenshot] };
		expect(
			docsPageSchema.safeParse({ ...validPage, sections: [section] }).success,
		).toBe(valid);
	});

	it.each([
		["{{screenshot:sessions-dashboard.png}}", true],
		["{{screenshot:other.png}}", false],
	])("validates the screenshot placeholder %s", (markdown, valid) => {
		const section = { ...validPage.sections[0], markdown };
		expect(
			docsPageSchema.safeParse({ ...validPage, sections: [section] }).success,
		).toBe(valid);
	});

	it("rejects a nav group that is not declared", () => {
		expect(
			docsPageSchema.safeParse({ ...validPage, group: "Misc" }).success,
		).toBe(false);
	});

	it("requires covers and at least one section", () => {
		const { covers: _covers, ...withoutCovers } = validPage;
		expect(docsPageSchema.safeParse(withoutCovers).success).toBe(false);
		expect(
			docsPageSchema.safeParse({ ...validPage, sections: [] }).success,
		).toBe(false);
	});

	it("rejects a non-kebab id and a non-png screenshot file", () => {
		expect(
			docsPageSchema.safeParse({ ...validPage, id: "Getting Started" }).success,
		).toBe(false);
		const screenshot = {
			...validPage.sections[0].screenshots[0],
			file: "shot.jpg",
		};
		const section = { ...validPage.sections[0], screenshots: [screenshot] };
		expect(
			docsPageSchema.safeParse({ ...validPage, sections: [section] }).success,
		).toBe(false);
	});
});
