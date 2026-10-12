import { Stack } from "@mui/material";
import type { LocalScreenshot, ScreenshotLabel } from "../../useScreenshots";
import { ScreenshotLabelField } from "./ScreenshotLabelFields/ScreenshotLabelField";

export const screenshotGroupListId = "screenshot-groups";

function fileBaseName(path: string): string {
	return (path.split(/[\\/]/).pop() ?? path).replace(/\.[^.]+$/, "");
}

export function ScreenshotLabelFields({
	screenshot,
	onUpdate,
}: {
	screenshot: LocalScreenshot;
	onUpdate: (id: number, patch: ScreenshotLabel) => void;
}) {
	return (
		<Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
			<ScreenshotLabelField
				label="Caption"
				value={screenshot.alt}
				onCommit={(alt) =>
					onUpdate(screenshot.id, {
						alt: alt || fileBaseName(screenshot.path),
					})
				}
			/>
			<ScreenshotLabelField
				label="Group"
				value={screenshot.group ?? ""}
				listId={screenshotGroupListId}
				onCommit={(group) => onUpdate(screenshot.id, { group })}
			/>
		</Stack>
	);
}
