import {
	DiffClosableLayout,
	type DiffScrollRegionProps,
} from "./DiffContent/DiffClosableLayout";
import { diffBodyProps } from "./DiffContent/diffBodyProps";
import { DiffContentBody } from "./DiffContent/DiffContentBody";
import { DiffSnackbars } from "./DiffContent/DiffSnackbars";
import { DiffToolbar } from "./DiffContent/DiffToolbar";
import type { DiffPanelMode } from "./toggleDiffPanel";
import type { SessionInfo } from "../types";
import { useDiffContent } from "./DiffContent/useDiffContent";

export function DiffContent({
	cwd,
	sessionId,
	scope,
	onScopeChange,
	sessions,
	sendInput,
	mode,
	onToggleMode,
	onClose,
	scrollRegionProps,
}: {
	cwd: string;
	sessionId?: string;
	scope: string;
	onScopeChange: (scope: string) => void;
	sessions: SessionInfo[];
	sendInput: (sessionId: string, data: string) => void;
	mode?: DiffPanelMode;
	onToggleMode?: () => void;
	onClose?: () => void;
	scrollRegionProps?: DiffScrollRegionProps;
}) {
	const diff = useDiffContent(cwd, sessionId, scope, sessions, sendInput);

	return (
		<>
			<DiffClosableLayout
				onClose={onClose}
				scrollRegionProps={scrollRegionProps}
			>
				<DiffToolbar
					{...diff.filters}
					{...diff.treePanel}
					{...diff.collapseAll}
					scope={diff.scopeState}
					onScopeChange={onScopeChange}
					totals={diff.totals}
					commentHint={diff.comments.unavailable}
					mode={mode}
					onToggleMode={onToggleMode}
					onClose={onClose}
				/>
				<DiffContentBody {...diffBodyProps(diff, cwd)} />
			</DiffClosableLayout>
			<DiffSnackbars
				sentTo={diff.comments.sentTo}
				clearSent={diff.comments.clearSent}
				revertError={diff.revert.error}
				clearRevertError={diff.revert.clearError}
			/>
		</>
	);
}
