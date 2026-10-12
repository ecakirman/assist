import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

const skeletonSx = { display: "grid", gap: 1.25, p: 1.5 } as const;

const WIDTHS = [86, 64, 86, 64];

export function ReleaseQueuedSkeleton() {
	return (
		<Box sx={skeletonSx} aria-label="Loading changes">
			{WIDTHS.map((width, index) => (
				<Skeleton
					key={index}
					variant="rounded"
					height={10}
					width={`${width}%`}
				/>
			))}
		</Box>
	);
}
