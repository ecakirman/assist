import { useTheme } from "@mui/material/styles";

export function useBuildColor() {
	return useTheme().design === "slate" ? "primary" : "success";
}
