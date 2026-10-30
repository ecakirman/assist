import type { Theme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

const slateCodeSx = (t: Theme) => ({
	fontFamily: t.typography.fontFamilyMono,
	fontSize: 11.5,
	color: "text.primary",
});

export function NextScopeLine({
	label,
	value,
	unset,
	setter,
	showSetter,
	inline = false,
}: {
	label: string;
	value: ReactNode;
	unset: string;
	setter: string;
	showSetter: boolean;
	inline?: boolean;
}) {
	return (
		<Typography
			variant="body2"
			component={inline ? "span" : "p"}
			sx={{ color: "text.secondary", fontSize: inline ? "inherit" : undefined }}
		>
			{label}: {value ?? unset}
			{showSetter && (
				<>
					{" · set with "}
					<Typography
						component="code"
						variant="body2"
						sx={inline ? slateCodeSx : { fontFamily: "fontFamilyMono" }}
					>
						{setter}
					</Typography>
				</>
			)}
		</Typography>
	);
}
