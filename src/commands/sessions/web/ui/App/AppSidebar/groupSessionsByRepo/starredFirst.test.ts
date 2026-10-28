import { describe, expect, it } from "vitest";
import { starredFirst } from "./starredFirst";

type Item = {
	id: string;
	starred?: boolean;
};

const item = (id: string, starred = false): Item => ({ id, starred });

function order(items: Item[]): string[] {
	return starredFirst(items, (i) => i.starred === true).map((i) => i.id);
}

describe("starredFirst", () => {
	it("orders starred items before the rest", () => {
		const items = [item("plain"), item("starred", true)];

		expect(order(items)).toEqual(["starred", "plain"]);
	});

	it("preserves the given order within the starred and unstarred items", () => {
		const items = [item("a"), item("b", true), item("c"), item("d", true)];

		expect(order(items)).toEqual(["b", "d", "a", "c"]);
	});

	it("leaves the order untouched when nothing is starred", () => {
		const items = [item("a"), item("b"), item("c")];

		expect(order(items)).toEqual(["a", "b", "c"]);
	});
});
