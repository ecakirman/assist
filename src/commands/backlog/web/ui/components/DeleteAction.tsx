import { Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { deleteItem } from "../api";
import { useApiNode } from "../../../../sessions/web/ui/useApiNode";
import { useRepoCwd } from "../useRepoCwd";
import { ConfirmDialog } from "./ConfirmDialog";

export function DeleteAction({
	itemId,
	onDeleted,
}: {
	itemId: number;
	onDeleted: () => Promise<void>;
}) {
	const { design } = useTheme();
	const cwd = useRepoCwd();
	const node = useApiNode();
	const [confirming, setConfirming] = useState(false);
	return (
		<>
			{confirming && (
				<ConfirmDialog
					onConfirm={async () => {
						await deleteItem(itemId, cwd, node);
						await onDeleted();
					}}
					onCancel={() => setConfirming(false)}
				/>
			)}
			<Button
				variant={design === "slate" ? "outlined" : "contained"}
				color="error"
				size="small"
				onClick={() => setConfirming(true)}
			>
				Delete
			</Button>
		</>
	);
}
