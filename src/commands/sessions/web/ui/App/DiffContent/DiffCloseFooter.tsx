import { Button, Divider, Stack } from "@mui/material";

export function DiffCloseFooter({ onClose }: { onClose: () => void }) {
	return (
		<>
			<Divider />
			<Stack direction="row" sx={{ p: 2, justifyContent: "flex-end" }}>
				<Button variant="outlined" onClick={onClose}>
					Close
				</Button>
			</Stack>
		</>
	);
}
