// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { HelpButton } from "./HelpButton";

afterEach(cleanup);

describe("HelpButton", () => {
	it("opens the assist docs in a new window", () => {
		render(<HelpButton />);

		const link = screen.getByRole("link", { name: "Help" });
		expect(link.getAttribute("href")).toBe(
			"https://staffordwilliams.com/assist",
		);
		expect(link.getAttribute("target")).toBe("_blank");
		expect(link.getAttribute("rel")).toBe("noopener noreferrer");
	});
});
