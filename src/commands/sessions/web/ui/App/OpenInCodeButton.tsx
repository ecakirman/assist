import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { ActionButton } from "./ActionButton";
import { ErrorSnackbar } from "../ErrorSnackbar";
import { OpenInCodeIcon } from "./OpenInCodeButton/OpenInCodeIcon";
import { OpenInCodeTooltip } from "./OpenInCodeButton/OpenInCodeTooltip";
import { requestOpenInCode } from "./OpenInCodeButton/requestOpenInCode";
import type { ShortcutName } from "./shortcutRegistry";
import { useApiNode } from "../useApiNode";

export function OpenInCodeButton({
	cwd,
	variant = "toolbar",
	shortcut,
}: {
	cwd: string;
	variant?: "toolbar" | "card";
	shortcut?: ShortcutName;
}) {
	const [error, setError] = useState<string | null>(null);
	const isCard = variant === "card";
	const outlined = useTheme().design === "slate" && !isCard;
	const node = useApiNode();

	return (
		<>
			<OpenInCodeTooltip show={!shortcut} outlined={outlined}>
				<ActionButton
					label="VS Code"
					title={shortcut ? "Open in VS Code" : undefined}
					ariaLabel="Open in VS Code"
					tone={isCard ? "muted" : outlined ? "secondary" : "inherit"}
					size={isCard ? "small" : "medium"}
					disabled={!cwd}
					shortcut={shortcut}
					icon={<OpenInCodeIcon outlined={outlined} small={isCard} />}
					onClick={(e) => {
						e.stopPropagation();
						void requestOpenInCode(cwd, node).then(
							(failure) => failure && setError(failure),
						);
					}}
				/>
			</OpenInCodeTooltip>
			<ErrorSnackbar error={error} onClose={() => setError(null)} />
		</>
	);
}
