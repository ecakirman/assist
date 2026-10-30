import { useEffect } from "react";
import { inboxStore } from "../../AppRoutes/InboxView/inboxStore";
import { useInboxMessages } from "../../AppRoutes/InboxView/useInboxMessages";

const POLL_MS = 60_000;

export function useInboxCount(): number {
	const messages = useInboxMessages();

	useEffect(() => {
		void inboxStore.refresh();
		const timer = setInterval(() => void inboxStore.refresh(), POLL_MS);
		return () => clearInterval(timer);
	}, []);

	return messages?.length ?? 0;
}
