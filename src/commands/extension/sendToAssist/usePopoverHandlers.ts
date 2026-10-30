import { closeWhenFocusLeaves } from "./closeWhenFocusLeaves";
import { copyWhenEmptyKeyDown } from "./copyWhenEmptyKeyDown";
import { popoverKeyDown } from "./popoverKeyDown";

export function usePopoverHandlers({
	instructions,
	onSend,
	onClose,
	busy,
	keepOpen,
	keepDraftOnBlur,
	copyWhenEmpty,
}: {
	instructions: string;
	onSend: (instructions: string, button: number) => void;
	onClose: (restoreFocus: boolean) => void;
	busy: boolean;
	keepOpen: boolean;
	keepDraftOnBlur: boolean;
	copyWhenEmpty?: string;
}) {
	const send = (button: number) => {
		if (!busy) onSend(instructions, button);
	};
	const onKeyDown = copyWhenEmptyKeyDown(
		copyWhenEmpty,
		!instructions,
		popoverKeyDown(onClose, () => send(0)),
	);
	const hasDraft = keepDraftOnBlur && instructions.trim() !== "";
	const onBlur = closeWhenFocusLeaves(keepOpen || busy || hasDraft, onClose);
	return { send, onKeyDown, onBlur };
}
