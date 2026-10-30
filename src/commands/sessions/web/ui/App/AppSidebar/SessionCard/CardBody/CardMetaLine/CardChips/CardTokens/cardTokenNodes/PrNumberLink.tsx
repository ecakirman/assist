import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";
import { tokenBadgeSx } from "../../../../../../../../designSystem/tokenBadgeSx";
import type { SessionInfo } from "../../../../../../../../types";
import { usePrStatus } from "../../../../../../../usePrStatus";

const sx = {
	color: "primary.main",
	opacity: 0.85,
	whiteSpace: "nowrap",
} as const;

const plainSx = { whiteSpace: "nowrap" } as const;

const slateSx = tokenBadgeSx("secondary");

export function PrNumberLink({
	session,
	prNumber,
}: {
	session: SessionInfo;
	prNumber: number;
}) {
	const pr = usePrStatus(session.cwd, prNumber, session.status);
	const slate = useTheme().design === "slate";
	const label = `#${prNumber}`;

	if (!pr?.url)
		return (
			<Box component="span" sx={slate ? slateSx : plainSx}>
				{label}
			</Box>
		);

	return (
		<Link
			href={pr.url}
			target="_blank"
			rel="noopener noreferrer"
			underline="hover"
			sx={slate ? slateSx : sx}
			onMouseDown={(e) => e.stopPropagation()}
			onClick={(e) => e.stopPropagation()}
		>
			{label}
		</Link>
	);
}
