import Stack from "@mui/material/Stack";
import { useEffect } from "react";
import { PageShell } from "../../PageShell";
import { InboxItem } from "./InboxView/InboxItem";
import { inboxStore } from "./InboxView/inboxStore";
import { useInboxMessages } from "./InboxView/useInboxMessages";

export function InboxView() {
	const messages = useInboxMessages();

	useEffect(() => {
		void inboxStore.refresh();
	}, []);

	return (
		<PageShell
			loading={messages === undefined}
			isEmpty={messages?.length === 0}
			emptyMessage="No flagged messages. Run assist inbox scan to check Gmail and Slack."
		>
			<Stack spacing={1}>
				{messages?.map((message) => (
					<InboxItem
						key={message.id}
						message={message}
						onDismiss={() => void inboxStore.dismiss(message.id)}
					/>
				))}
			</Stack>
		</PageShell>
	);
}
