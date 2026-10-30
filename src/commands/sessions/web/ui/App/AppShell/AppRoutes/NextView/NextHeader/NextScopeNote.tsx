import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import type { NextBoard, NextScope } from "../../../../../../next/types";
import { InlineScopeLines } from "./NextScopeNote/InlineScopeLines";
import { NextScopeLine } from "./NextScopeNote/NextScopeLine";
import { projectsValue } from "./NextScopeNote/projectsValue";

function repoValue(configured: string[] | null, selfRepo: string | null) {
	if (configured) return configured.join(", ");
	return selfRepo ? `${selfRepo} (this repo, by default)` : null;
}

export function NextScopeNote({
	scope,
	boards,
}: {
	scope: NextScope;
	boards: NextBoard[];
}) {
	const inline = useTheme().design === "slate";
	const lines = [
		<NextScopeLine
			key="peers"
			inline={inline}
			label="Peers"
			value={scope.peers.length > 0 ? scope.peers.join(", ") : null}
			unset="none — only PRs requesting your review appear"
			setter="assist config set next.peers alice,bob -g --repo"
			showSetter={scope.peers.length === 0}
		/>,
		<NextScopeLine
			key="repos"
			inline={inline}
			label="Repos"
			value={repoValue(scope.repos, scope.selfRepo)}
			unset="none"
			setter="assist config set next.repos my-org,other/web -g --repo"
			showSetter={!scope.repos}
		/>,
		<NextScopeLine
			key="projects"
			inline={inline}
			label="Projects"
			value={projectsValue(scope, boards)}
			unset="none — no project items are suggested"
			setter="assist config set next.projects my-org/3,my-org/5 -g --repo"
			showSetter={scope.projects.length === 0}
		/>,
	];
	if (inline) return <InlineScopeLines lines={lines} />;
	return <Stack spacing={0.25}>{lines}</Stack>;
}
