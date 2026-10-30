const pageSx = { maxWidth: 980, mx: 0, px: 3.5, py: 2.5 } as const;

export function useNextPageLayout() {
	return {
		shell: { maxWidth: false as const, sx: pageSx },
		spacing: "22px",
	};
}
