import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { Fragment } from "react";
import { cardTokenNodes } from "./CardTokens/cardTokenNodes";
import type { SessionInfo } from "../../../../../../types";
import { useInRepoGroupContext } from "../../../../useInRepoGroupContext";
import { useItemTrackers } from "../../../../useItemTrackers";

const sepSx = { opacity: 0.35, mx: 0.5 } as const;

export function CardTokens({ session }: { session: SessionInfo }) {
	const grouped = useInRepoGroupContext();
	const trackerFor = useItemTrackers(session.cwd);
	const tokens = cardTokenNodes(
		session,
		grouped,
		trackerFor(session.activity?.itemId),
	);

	const slate = useTheme().design === "slate";
	const separated = (index: number) =>
		index > 0 && !(slate && (tokens[index].badge || tokens[index - 1].badge));

	return (
		<>
			{tokens.map((token, index) => (
				<Fragment key={token.key}>
					{separated(index) && (
						<Box component="span" sx={sepSx}>
							·
						</Box>
					)}
					{token.node}
				</Fragment>
			))}
		</>
	);
}
