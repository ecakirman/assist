import Typography from "@mui/material/Typography";
import { Fragment, type ReactElement } from "react";

export function InlineScopeLines({ lines }: { lines: ReactElement[] }) {
	return (
		<Typography sx={{ m: 0, fontSize: 12.5, color: "text.secondary" }}>
			{lines.map((line, i) => (
				<Fragment key={line.key}>
					{i > 0 && " · "}
					{line}
				</Fragment>
			))}
		</Typography>
	);
}
