import { useTheme } from "@mui/material/styles";

const slatePageSx = { maxWidth: 980, mx: 0, px: 3.5, py: 2.5 } as const;

export function useNextPageLayout() {
	const slate = useTheme().design === "slate";
	if (!slate) return { shell: {}, spacing: 3 };
	return {
		shell: { maxWidth: false as const, sx: slatePageSx },
		spacing: "22px",
	};
}
