import { ConfirmDialog } from "../../../../../../../../../backlog/web/ui/components/ConfirmDialog";

type Props = {
	label: string;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
};

export function ConfigArrayItemRemoveDialog({
	label,
	message,
	onConfirm,
	onCancel,
}: Props) {
	return (
		<ConfirmDialog
			title={`Remove ${label}`}
			message={message}
			confirmLabel="Remove"
			onConfirm={() => {
				onCancel();
				onConfirm();
			}}
			onCancel={onCancel}
		/>
	);
}
