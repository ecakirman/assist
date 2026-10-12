// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { LocalScreenshot } from "../../useScreenshots";
import { ScreenshotThumbnail } from "./ScreenshotThumbnail";

afterEach(cleanup);

const image: LocalScreenshot = {
	id: 1,
	path: "/staged/u1/shot.png",
	alt: "shot",
	url: "blob:image",
	contentType: "image/png",
};

describe("ScreenshotThumbnail", () => {
	it("renders an image attachment as an img", () => {
		render(
			<ScreenshotThumbnail
				screenshot={image}
				onRemove={() => {}}
				onUpdate={() => {}}
			/>,
		);

		expect(screen.getByAltText("screenshot").tagName).toBe("IMG");
	});

	it("renders a video attachment as a playable video", () => {
		render(
			<ScreenshotThumbnail
				screenshot={{
					id: 1,
					path: "/staged/u2/clip.mov",
					alt: "clip",
					url: "blob:video",
					contentType: "video/quicktime",
				}}
				onRemove={() => {}}
				onUpdate={() => {}}
			/>,
		);

		const video = screen.getByLabelText("screenshot");
		expect(video.tagName).toBe("VIDEO");
		expect(video.hasAttribute("controls")).toBe(true);
	});

	it("commits edited caption and group on blur", () => {
		const onUpdate = vi.fn();
		render(
			<ScreenshotThumbnail
				screenshot={image}
				onRemove={() => {}}
				onUpdate={onUpdate}
			/>,
		);

		const caption = screen.getByLabelText("Caption");
		fireEvent.change(caption, { target: { value: " Dark " } });
		fireEvent.blur(caption);
		const group = screen.getByLabelText("Group");
		fireEvent.change(group, { target: { value: "Profile" } });
		fireEvent.blur(group);

		expect(onUpdate).toHaveBeenCalledWith(1, { alt: "Dark" });
		expect(onUpdate).toHaveBeenCalledWith(1, { group: "Profile" });
	});

	it("falls back to the file name when the caption is cleared", () => {
		const onUpdate = vi.fn();
		render(
			<ScreenshotThumbnail
				screenshot={{ ...image, alt: "Light" }}
				onRemove={() => {}}
				onUpdate={onUpdate}
			/>,
		);

		const caption = screen.getByLabelText("Caption");
		fireEvent.change(caption, { target: { value: "" } });
		fireEvent.blur(caption);

		expect(onUpdate).toHaveBeenCalledWith(1, { alt: "shot" });
	});
});
