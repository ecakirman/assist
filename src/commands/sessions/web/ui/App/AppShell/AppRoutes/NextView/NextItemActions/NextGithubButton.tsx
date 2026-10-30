import Button, { type ButtonProps } from "@mui/material/Button";

export function NextGithubButton({
	url,
	variant,
	size,
}: {
	url: string;
	variant: ButtonProps["variant"];
	size: "small" | "medium";
}) {
	return (
		<Button
			variant={variant}
			size={size}
			href={url}
			target="_blank"
			rel="noopener noreferrer"
		>
			GitHub ↗
		</Button>
	);
}
