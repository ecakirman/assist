import { fireEvent } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { headerQueries } from "./headerQueries";

const { expanded, row } = headerQueries;

function setTop(el: HTMLElement, top: number) {
	el.getBoundingClientRect = () => ({ top }) as DOMRect;
}

function mockScrollIntoView() {
	const scrollIntoView = vi.fn();
	Element.prototype.scrollIntoView = scrollIntoView;
	return scrollIntoView;
}

export function describeStuckHeaderCollapse(
	name: string,
	renderView: () => void,
) {
	describe(`${name} stuck file header collapse`, () => {
		afterEach(() => {
			Reflect.deleteProperty(Element.prototype, "scrollIntoView");
		});

		it("scrolls a stuck header's file into view when collapsing it", () => {
			const scrollIntoView = mockScrollIntoView();
			renderView();
			const header = row("b.graphql");
			const file = header.parentElement as HTMLElement;
			setTop(file, -500);
			setTop(header, 40);
			fireEvent.click(header);
			expect(scrollIntoView).toHaveBeenCalledWith({ block: "start" });
			expect(scrollIntoView.mock.contexts[0]).toBe(file);
		});

		it("does not scroll when collapsing an unstuck header", () => {
			const scrollIntoView = mockScrollIntoView();
			renderView();
			fireEvent.click(row("a.graphql"));
			expect(expanded("a.graphql")).toBe(false);
			fireEvent.click(row("a.graphql"));
			expect(scrollIntoView).not.toHaveBeenCalled();
		});
	});
}
