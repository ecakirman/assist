// @vitest-environment jsdom
import {
	act,
	cleanup,
	fireEvent,
	render,
	screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ConfigObjectListNode } from "../../../../../../../shared/ConfigNode";
import { describeConfigNode } from "../../../../../../../shared/describeConfigNode";
import { assistConfigSchema } from "../../../../../../../shared/types";
import { configEntryNode } from "../../../../../../config/configEntryNode";
import type { ConfigEntry } from "../../../../../../config/readConfigEntries";
import { ConfigArrayRow } from "./ConfigArrayRow";

const schema = describeConfigNode(assistConfigSchema);

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
});

function stubWrites() {
	const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) => ({
		ok: true,
		status: 200,
		json: async () => ({ target: "project" }),
	}));
	vi.stubGlobal("fetch", fetchMock);
	return fetchMock;
}

const runs = [
	{
		name: "build",
		command: "npm",
		params: [{ name: "stage" }],
		env: { LOG: "debug" },
	},
	{ name: "test", command: "vitest" },
];

function renderRow() {
	const node = configEntryNode(schema, "run") as ConfigObjectListNode;
	const entry: ConfigEntry = {
		key: "run",
		type: "array",
		value: runs,
		source: "project",
		sources: ["project"],
		repoKey: "assist",
		layers: { project: runs },
		node,
	};
	render(
		<ConfigArrayRow
			entry={entry}
			node={node}
			cwd="/repo"
			onSaved={vi.fn()}
			onError={vi.fn()}
		/>,
	);
}

function click(name: string) {
	fireEvent.click(screen.getByRole("button", { name }));
}

describe("ConfigArrayRow", () => {
	it("asks before removing a top-level item, naming it and its file", () => {
		const fetchMock = stubWrites();
		renderRow();

		click("Remove run[0]");

		expect(screen.getByRole("dialog").textContent).toContain(
			`Remove "build" (run[0]) from this repo's assist.yml?`,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("removes the item once the removal is confirmed", async () => {
		const fetchMock = stubWrites();
		renderRow();

		click("Remove run[0]");
		await act(async () => click("Remove"));

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0] ?? [];
		expect(url).toBe("/api/config/set");
		expect(JSON.parse(String(init?.body))).toEqual({
			key: "run",
			value: [runs[1]],
			cwd: "/repo",
			scope: "project",
		});
	});

	it("keeps the item when the removal is cancelled", () => {
		const fetchMock = stubWrites();
		renderRow();

		click("Remove run[0]");
		click("Cancel");

		expect(screen.queryByRole("dialog")).toBeNull();
		expect(screen.getByText("build")).toBeTruthy();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("removes nested rows inside an open draft without asking", () => {
		const fetchMock = stubWrites();
		renderRow();

		click("Edit run[0]");
		click("Remove run[0].params[0]");
		click("Remove run[0].env entry 1");

		expect(screen.queryByRole("dialog")).toBeNull();
		expect(screen.queryByLabelText("run[0].params[0].name")).toBeNull();
		expect(screen.queryByLabelText("run[0].env.LOG")).toBeNull();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
