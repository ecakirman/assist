import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export function NoSessionsHint() {
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				height: "100%",
			}}
		>
			<Typography variant="body2" color="text.disabled">
				Create a session to get started
			</Typography>
		</Box>
	);
}
