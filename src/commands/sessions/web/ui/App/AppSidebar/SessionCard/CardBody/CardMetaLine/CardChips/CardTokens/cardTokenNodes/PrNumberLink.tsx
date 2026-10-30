import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { tokenBadgeSx } from "../../../../../../../../designSystem/tokenBadgeSx";
import type { SessionInfo } from "../../../../../../../../types";
import { usePrStatus } from "../../../../../../../usePrStatus";

const sx = tokenBadgeSx("secondary");

export function PrNumberLink({
	session,
	prNumber,
}: {
	session: SessionInfo;
	prNumber: number;
}) {
	const pr = usePrStatus(session.cwd, prNumber, session.status);
	const label = `#${prNumber}`;

	if (!pr?.url)
		return (
			<Box component="span" sx={sx}>
				{label}
			</Box>
		);

	return (
		<Link
			href={pr.url}
			target="_blank"
			rel="noopener noreferrer"
			underline="hover"
			sx={sx}
			onMouseDown={(e) => e.stopPropagation()}
			onClick={(e) => e.stopPropagation()}
		>
			{label}
		</Link>
	);
}
