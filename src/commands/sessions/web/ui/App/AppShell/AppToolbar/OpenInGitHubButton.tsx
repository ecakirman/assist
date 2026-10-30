import GitHubIcon from "@mui/icons-material/GitHub";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import { useEffect, useState } from "react";
import { toolbarIconSx } from "../../../designSystem/toolbarIconSx";
import { GitHubOutlineIcon } from "./OpenInGitHubButton/GitHubOutlineIcon";
import { useApiNode } from "../../../useApiNode";
import { withNode } from "../../../withNode";

const sx = { color: "inherit" } as const;

export function OpenInGitHubButton({ cwd }: { cwd: string }) {
	const [url, setUrl] = useState<string | null>(null);
	const node = useApiNode();
	const slate = useTheme().design === "slate";

	useEffect(() => {
		if (!cwd) {
			setUrl(null);
			return;
		}
		let cancelled = false;
		(async () => {
			try {
				const res = await fetch(
					withNode(`/api/github-url?cwd=${encodeURIComponent(cwd)}`, node),
				);
				const body = await res.json();
				if (!cancelled) setUrl(body?.url ?? null);
			} catch {
				if (!cancelled) setUrl(null);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [cwd, node]);

	if (!url) return null;

	return (
		<Tooltip title="Open in GitHub">
			<Box component="span" sx={slate ? toolbarIconSx : undefined}>
				<IconButton
					sx={slate ? undefined : sx}
					onClick={() => window.open(url, "_blank")}
				>
					{slate ? <GitHubOutlineIcon /> : <GitHubIcon />}
				</IconButton>
			</Box>
		</Tooltip>
	);
}
