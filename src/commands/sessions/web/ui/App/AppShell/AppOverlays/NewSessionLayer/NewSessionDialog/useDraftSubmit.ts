import type { FormEvent } from "react";
import type { HarnessKind } from "../../../../../../../../../shared/harnesses";
import type { NewSessionLaunchers } from "../launchNewSession";
import type { NewSessionDraft } from "../useNewSessionDraft";
import { submitDraft } from "./useDraftSubmit/submitDraft";
import type { useDraftRepos } from "./useDraftRepos";
import { useQueuedSubmit } from "./useDraftSubmit/useQueuedSubmit";

type DraftTarget = ReturnType<typeof useDraftRepos>["target"];

export function useDraftSubmit(
	draft: NewSessionDraft,
	harness: HarnessKind,
	target: DraftTarget,
	launchers: NewSessionLaunchers,
	onClose: () => void,
) {
	const requestSubmit = useQueuedSubmit(draft, () => {
		if (submitDraft(draft, harness, target, launchers)) onClose();
	});
	return (e: FormEvent) => {
		e.preventDefault();
		requestSubmit();
	};
}
