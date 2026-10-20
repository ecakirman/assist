import { attachArgs } from "../../prs/attachArgs";
import { runGhWithAttachments } from "../../prs/runGhWithAttachments";
import type { PreviewAttachment } from "../../sessions/shared/PreviewAttachment";

export function runGhIssueCreate(
	title: string,
	body: string,
	repo: string | undefined,
	metadata: { labels?: string[]; milestone?: string } | undefined,
	attachments: PreviewAttachment[] = [],
): string {
	const args = ["issue", "create", "--title", title, "--body", body];
	if (repo) args.push("--repo", repo);
	for (const label of metadata?.labels ?? []) args.push("--label", label);
	if (metadata?.milestone) args.push("--milestone", metadata.milestone);
	args.push(...attachArgs(attachments));
	return runGhWithAttachments(args, attachments);
}
