import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { describeStuckHeaderCollapse } from "./describeHeaderClicks/describeStuckHeaderCollapse";
import { headerQueries } from "./describeHeaderClicks/headerQueries";

const { chevron, expanded, row } = headerQueries;

export function describeHeaderClicks(name: string, renderView: () => void) {
	describe(`${name} file header clicks`, () => {
		it("toggles when the row is clicked", () => {
			renderView();
			fireEvent.click(row("a.graphql"));
			expect(expanded("a.graphql")).toBe(false);
			fireEvent.click(row("a.graphql"));
			expect(expanded("a.graphql")).toBe(true);
		});

		it("toggles when the status or line counts are clicked", () => {
			renderView();
			const header = row("a.graphql");
			fireEvent.click(within(header).getByText("modified"));
			expect(expanded("a.graphql")).toBe(false);
			fireEvent.click(within(header).getByText("+1"));
			expect(expanded("a.graphql")).toBe(true);
		});

		it("does not toggle when the path link is clicked", () => {
			renderView();
			const link = screen.getByRole("link", { name: "a.graphql" });
			expect(link.getAttribute("target")).toBe("_blank");
			fireEvent.click(link);
			expect(expanded("a.graphql")).toBe(true);
		});

		it("toggles once when the chevron is clicked", () => {
			renderView();
			fireEvent.click(chevron("a.graphql"));
			expect(expanded("a.graphql")).toBe(false);
			expect(chevron("a.graphql").getAttribute("aria-label")).toBe(
				"Expand a.graphql",
			);
			expect(expanded("b.graphql")).toBe(true);
		});
	});
	describeStuckHeaderCollapse(name, renderView);
}
