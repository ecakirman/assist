// @vitest-environment jsdom
import { runInNewContext } from "node:vm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createLiveReload } from "./createLiveReload";

class FakeEventSource {
	static CLOSED = 2;
	static last: FakeEventSource;
	readyState = 1;
	onopen?: () => void;
	onerror?: () => void;
	onmessage?: (event: { data: string }) => void;
	constructor() {
		FakeEventSource.last = this;
	}
}

const reload = vi.fn();

function runClient(): FakeEventSource {
	const html = createLiveReload().inject("<body></body>");
	runInNewContext(/<script>([\s\S]*)<\/script>/.exec(html)?.[1] ?? "", {
		EventSource: FakeEventSource,
		location: { reload, href: "http://localhost/" },
		document,
		MutationObserver,
		URL,
		Date,
	});
	const source = FakeEventSource.last;
	source.onopen?.();
	return source;
}

function openPopover(): HTMLElement {
	const host = document.createElement("div");
	host.setAttribute("data-assist-popover", "");
	document.body.append(host);
	return host;
}

const settle = () => new Promise((resolve) => setTimeout(resolve));

beforeEach(() => {
	reload.mockReset();
	document.body.innerHTML = "";
	document.head.innerHTML = "";
});

describe("live reload client", () => {
	it("reloads on a page change when no feedback is being written", () => {
		runClient().onmessage?.({ data: "page" });
		expect(reload).toHaveBeenCalledOnce();
	});

	it("defers a page change until the feedback popover closes", async () => {
		const source = runClient();
		const popover = openPopover();
		source.onmessage?.({ data: "page" });
		source.onmessage?.({ data: "page" });
		await settle();
		expect(reload).not.toHaveBeenCalled();

		popover.remove();
		await settle();
		expect(reload).toHaveBeenCalledOnce();
	});

	it("defers the reload after a preview restart while feedback is being written", async () => {
		const source = runClient();
		const popover = openPopover();
		source.onopen?.();
		await settle();
		expect(reload).not.toHaveBeenCalled();

		popover.remove();
		await settle();
		expect(reload).toHaveBeenCalledOnce();
	});

	it("restyles without reloading on a stylesheet change", () => {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = "http://localhost/site.css";
		document.head.append(link);
		openPopover();

		runClient().onmessage?.({ data: "css" });

		expect(reload).not.toHaveBeenCalled();
		expect(new URL(link.href).searchParams.has("t")).toBe(true);
	});
});
