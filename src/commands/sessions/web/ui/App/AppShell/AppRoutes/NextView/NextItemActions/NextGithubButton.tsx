import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Button, { type ButtonProps } from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";

export function NextGithubButton({
	url,
	variant,
	size,
}: {
	url: string;
	variant: ButtonProps["variant"];
	size: "small" | "medium";
}) {
	const slate = useTheme().design === "slate";
	return (
		<Button
			variant={variant}
			size={size}
			startIcon={slate ? undefined : <OpenInNewIcon />}
			href={url}
			target="_blank"
			rel="noopener noreferrer"
		>
			{slate ? "GitHub ↗" : "GitHub"}
		</Button>
	);
}
