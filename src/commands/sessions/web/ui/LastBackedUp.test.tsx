// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LastBackedUp } from "./LastBackedUp";

const HOUR_MS = 60 * 60 * 1000;

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
});

function stubBackups(createdAts: Date[], staleAfterMs = 32 * HOUR_MS) {
	const list = createdAts.map((createdAt, id) => ({ id, createdAt }));
	vi.stubGlobal(
		"fetch",
		vi.fn(async (url: string) => {
			const body = url === "/api/backups/status" ? { staleAfterMs } : list;
			return { ok: true, status: 200, json: async () => body };
		}),
	);
}

function renderLink() {
	render(
		<MemoryRouter>
			<LastBackedUp />
		</MemoryRouter>,
	);
}

describe("LastBackedUp", () => {
	it("renders a muted link without a warning for a fresh backup", async () => {
		const createdAt = new Date(Date.now() - 2 * HOUR_MS);
		stubBackups([createdAt]);
		renderLink();
		const link = (await screen.findByText(/Last backed up/)).closest(
			"a",
		) as HTMLAnchorElement;
		expect(link.getAttribute("href")).toBe("/backups");
		expect(link.querySelector("svg")).toBeNull();
		expect(link.getAttribute("aria-label")).toBe(createdAt.toLocaleString());
	});

	it("warns with an overdue tooltip once the backup is older than 32h", async () => {
		const createdAt = new Date(Date.now() - 33 * HOUR_MS);
		stubBackups([createdAt]);
		renderLink();
		const link = (await screen.findByText(/Last backed up/)).closest(
			"a",
		) as HTMLAnchorElement;
		expect(link.querySelector("svg")).not.toBeNull();
		expect(link.getAttribute("aria-label")).toBe(
			`Backup overdue — last backed up ${createdAt.toLocaleString()}`,
		);
	});

	it("uses the configured threshold in place of the 32h default", async () => {
		stubBackups([new Date(Date.now() - 40 * HOUR_MS)], 48 * HOUR_MS);
		renderLink();
		const link = (await screen.findByText(/Last backed up/)).closest(
			"a",
		) as HTMLAnchorElement;
		expect(link.querySelector("svg")).toBeNull();
	});

	it("shows a 'Never backed up' warning link when no backup exists", async () => {
		stubBackups([]);
		renderLink();
		const link = (await screen.findByText(/Never backed up/)).closest(
			"a",
		) as HTMLAnchorElement;
		expect(link.getAttribute("href")).toBe("/backups");
		expect(link.querySelector("svg")).not.toBeNull();
	});
});
