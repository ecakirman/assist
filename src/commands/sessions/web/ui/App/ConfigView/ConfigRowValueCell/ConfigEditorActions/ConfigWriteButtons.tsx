import Button from "@mui/material/Button";
import { useState } from "react";
import { ConfirmDialog } from "../../../../../../../backlog/web/ui/components/ConfirmDialog";

type Props = {
	saving: boolean;
	canClear?: boolean;
	clearTitle?: string;
	onSave: () => void;
	onClear?: () => void;
	onCancel: () => void;
};

export function ConfigWriteButtons({
	saving,
	canClear,
	clearTitle,
	onSave,
	onClear,
	onCancel,
}: Props) {
	const [confirmingClear, setConfirmingClear] = useState(false);
	return (
		<>
			<Button
				size="small"
				variant="contained"
				disabled={saving}
				onClick={onSave}
			>
				Save
			</Button>
			<Button size="small" disabled={saving} onClick={onCancel}>
				Cancel
			</Button>
			{canClear && onClear && (
				<Button
					size="small"
					color="error"
					disabled={saving}
					title={clearTitle}
					onClick={() => setConfirmingClear(true)}
				>
					Clear
				</Button>
			)}
			{confirmingClear && onClear && (
				<ConfirmDialog
					title="Clear setting"
					message={`${clearTitle ?? "Remove this setting"}?`}
					confirmLabel="Clear"
					onConfirm={() => {
						setConfirmingClear(false);
						onClear();
					}}
					onCancel={() => setConfirmingClear(false)}
				/>
			)}
		</>
	);
}
