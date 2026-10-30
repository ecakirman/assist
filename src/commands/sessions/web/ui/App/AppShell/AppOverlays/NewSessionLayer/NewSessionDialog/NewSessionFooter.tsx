import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { SlateNewSessionFooter } from "./NewSessionFooter/SlateNewSessionFooter";
import {
	FOOTER_HINTS,
	type FooterProps,
	SubmitButton,
} from "./NewSessionFooter/SubmitButton";

const footerSx = {
	alignItems: "center",
	px: 1.5,
	py: 1,
	borderTop: 1,
	borderColor: "divider",
	bgcolor: "action.hover",
} as const;

export function NewSessionFooter(props: FooterProps) {
	const slate = useTheme().design === "slate";
	if (slate) return <SlateNewSessionFooter {...props} />;
	return (
		<Stack direction="row" spacing={1.5} sx={footerSx}>
			<Stack direction="row" spacing={1.5} sx={{ mr: "auto" }}>
				{FOOTER_HINTS.map(([key, action]) => (
					<Typography key={key} variant="caption" color="text.secondary">
						{key} {action}
					</Typography>
				))}
			</Stack>
			<SubmitButton {...props} size="small" />
		</Stack>
	);
}
