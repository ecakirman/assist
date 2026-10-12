import Link from "@mui/material/Link";
import type { ReactNode } from "react";

const linkSx = { fontWeight: 500 } as const;

export function ReleaseQueuedFooterLink({
	href,
	children,
}: {
	href: string;
	children: ReactNode;
}) {
	return (
		<Link
			sx={linkSx}
			href={href}
			target="_blank"
			rel="noreferrer"
			underline="hover"
		>
			{children} ↗
		</Link>
	);
}
