import type { HighLevelPreviewPayload } from "./types";

export type HighLevelOverlaySubject = HighLevelPreviewPayload & {
	title: string;
	headRef: string;
};
