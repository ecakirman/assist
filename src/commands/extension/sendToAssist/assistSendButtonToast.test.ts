// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { assistPopoverContent } from "./assistPopoverContent";
import { assistSendButton } from "./assistSendButton";
import { sendToAssist } from "./sendToAssist";
import { toggleAssistPopover } from "./toggleAssistPopover";

vi.mock("./assistPopoverContent", () => ({ assistPopoverContent: vi.fn() }));
vi.mock("./sendToAssist", () => ({ sendToAssist: vi.fn() }));
vi.mock("./toggleAssistPopover", () => ({ toggleAssistPopover: vi.fn() }));

const ADO_PR = "https://dev.azure.com/acme/proj/_git/site/pullrequest/42";

afterEach(() => {
	vi.clearAllMocks();
	document.body.innerHTML = "";
});

async function pick(url: string, args: string[]) {
	assistSendButton(() => url, "title", "header").click();
	const [, render] = vi.mocked(toggleAssistPopover).mock.calls[0];
	render(vi.fn());
	const [kind, { send }] = vi.mocked(assistPopoverContent).mock.calls[0];
	send({ args });
	await vi.waitFor(() =>
		expect(document.querySelector("[data-assist-toast]")).not.toBeNull(),
	);
	return { kind, toast: document.querySelector("[data-assist-toast]") };
}

describe("assistSendButton on an Azure DevOps PR", () => {
	it("toasts the server's not-cloned error", async () => {
		const error = "acme/proj/site is not cloned under /base";
		vi.mocked(sendToAssist).mockResolvedValue({ ok: false, message: error });
		const { kind, toast } = await pick(ADO_PR, ["review", "--checkout-only"]);
		expect(kind).toBe("azure-devops-review");
		expect(sendToAssist).toHaveBeenCalledWith({
			url: ADO_PR,
			args: ["review", "--checkout-only"],
		});
		expect(toast?.textContent).toBe(error);
	});

	it("toasts the server's unparseable-URL error", async () => {
		const error = "Not an Azure DevOps PR URL: https://dev.azure.com/acme";
		vi.mocked(sendToAssist).mockResolvedValue({ ok: false, message: error });
		const { toast } = await pick(ADO_PR, ["review-pr-comments"]);
		expect(toast?.textContent).toBe(error);
	});
});
