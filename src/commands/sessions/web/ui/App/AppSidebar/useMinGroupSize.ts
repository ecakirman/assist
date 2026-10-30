import { useTheme } from "@mui/material/styles";

export function useMinGroupSize() {
	return useTheme().design === "slate" ? 1 : 2;
}
