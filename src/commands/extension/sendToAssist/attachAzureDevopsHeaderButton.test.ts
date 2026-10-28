// @vitest-environment jsdom
import { act } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { azureDevopsPrActions } from "../../../shared/azureDevops/azureDevopsPrActions";
import { attachAzureDevopsHeaderButton } from "./attachAzureDevopsHeaderButton";

const PR_URL =
	"https://dev.azure.com/acme/Test%20Project/_git/Test%20Project/pullrequest/1";

const HEADER = `<div class="repos-pr-details-page"><div class="repos-pr-header bolt-header"><div class="flex-column"><div class="flex-row rhythm-horizontal-8"><div class="repos-pr-header-complete-button bolt-split-button"><button>Publish</button></div></div></div></div></div>`;

function buttons(): HTMLButtonElement[] {
	return Array.from(document.querySelectorAll("[data-assist-send]"));
}

function visit(href: string): void {
	vi.stubGlobal("location", new URL(href));
	document.body.innerHTML = HEADER;
	attachAzureDevopsHeaderButton();
}

afterEach(() => {
	document.querySelector("[data-assist-popover]")?.remove();
	document.body.innerHTML = "";
	vi.unstubAllGlobals();
});

describe("attachAzureDevopsHeaderButton", () => {
	it("puts the assist button before the PR's complete button", () => {
		visit(`${PR_URL}?_a=overview`);
		const row = document.querySelector(".rhythm-horizontal-8");
		expect(buttons()).toHaveLength(1);
		expect(row?.firstElementChild).toBe(buttons()[0]);
	});

	it("attaches once across repeated mutations", () => {
		visit(PR_URL);
		attachAzureDevopsHeaderButton();
		expect(buttons()).toHaveLength(1);
	});

	it("leaves pages that are not a PR alone", () => {
		visit("https://dev.azure.com/acme/Test%20Project/_git/Test%20Project");
		expect(buttons()).toHaveLength(0);
	});

	it("offers only the Azure DevOps PR actions", async () => {
		visit(PR_URL);
		await act(async () => buttons()[0].click());
		const items = Array.from(
			document
				.querySelector("[data-assist-popover]")
				?.shadowRoot?.querySelectorAll('[role="menuitem"]') ?? [],
		).map((item) => item.textContent);
		expect(items).toEqual(azureDevopsPrActions.map(({ label }) => label));
	});
});
