import type { PreviewAttachment } from "./PreviewAttachment";
import type { PrPreviewComment } from "./SessionInfoBase";

export type PreviewSelection = {
	topLeft: string;
	bottomRight: string;
};

export type PreviewChecklistNote = {
	id: string;
	comment: string;
};

export type PreviewChecklistItem = {
	id: string;
	ticked: boolean;
	comment?: string;
	notes?: PreviewChecklistNote[];
};

export type PreviewDecisionFields = {
	reason?: string;
	comments?: PrPreviewComment[];
	screenshots?: PreviewAttachment[];
	body?: string;
	reviewAfter?: boolean;
	announceAfter?: boolean;
	draft?: boolean;
	autoMerge?: boolean;
	autostart?: boolean;
	selection?: PreviewSelection;
	checklist?: PreviewChecklistItem[];
	dismissed?: boolean;
};

export type PreviewDecision = PreviewDecisionFields & {
	decision: "approve" | "reject";
};
