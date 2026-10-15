// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PreviewMetadataList } from "./PreviewMetadataList";

afterEach(cleanup);

describe("PreviewMetadataList", () => {
	it("links an item with a url in a new tab", () => {
		render(
			<PreviewMetadataList
				items={[
					{
						label: "Parent",
						value: "acme/widgets#26",
						url: "https://github.com/acme/widgets/issues/26",
					},
				]}
			/>,
		);

		const link = screen.getByRole("link", { name: "acme/widgets#26" });
		expect(link.getAttribute("href")).toBe(
			"https://github.com/acme/widgets/issues/26",
		);
		expect(link.getAttribute("target")).toBe("_blank");
		expect(link.getAttribute("rel")).toBe("noopener noreferrer");
	});

	it("renders an item without a url as plain text", () => {
		render(
			<PreviewMetadataList
				items={[{ label: "Repository", value: "acme/widgets" }]}
			/>,
		);

		expect(screen.getByText("acme/widgets")).toBeTruthy();
		expect(screen.queryByRole("link")).toBeNull();
	});
});
