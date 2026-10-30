import { useSyncExternalStore } from "react";
import { inboxStore } from "./inboxStore";
import type { InboxMessage } from "./types";

export function useInboxMessages(): InboxMessage[] | undefined {
	return useSyncExternalStore(inboxStore.subscribe, inboxStore.get);
}
