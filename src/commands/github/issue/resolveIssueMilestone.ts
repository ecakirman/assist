import { runGhGraphqlJson } from "../../../shared/runGhGraphqlJson";
import type { IssueRepoTarget } from "./resolveIssueRepoTarget";

const QUERY = `query($owner: String!, $repo: String!, $after: String) {
	repository(owner: $owner, name: $repo) {
		milestones(first: 100, after: $after, states: OPEN) {
			nodes { title }
			pageInfo { hasNextPage endCursor }
		}
	}
}`;

type MilestonesResponse = {
	data?: {
		repository?: {
			milestones?: {
				nodes?: ({ title?: string } | null)[];
				pageInfo?: { hasNextPage?: boolean; endCursor?: string | null };
			} | null;
		} | null;
	};
};

function readOpenMilestones(target: IssueRepoTarget): string[] {
	const titles: string[] = [];
	let after: string | undefined;
	do {
		const page = (
			JSON.parse(
				runGhGraphqlJson(QUERY, { ...target, after }),
			) as MilestonesResponse
		).data?.repository?.milestones;
		if (!page) {
			throw new Error(
				`No milestones could be read for ${target.owner}/${target.repo}`,
			);
		}
		for (const node of page.nodes ?? [])
			if (node?.title) titles.push(node.title);
		after = page.pageInfo?.hasNextPage
			? (page.pageInfo.endCursor ?? undefined)
			: undefined;
	} while (after);
	return titles;
}

export function resolveIssueMilestone(
	target: IssueRepoTarget,
	wanted: string,
): string {
	const titles = readOpenMilestones(target);
	const match =
		titles.find((title) => title === wanted) ??
		titles.find((title) => title.toLowerCase() === wanted.toLowerCase());
	if (!match) {
		const available = titles.length
			? `Its open milestones are ${titles.join(", ")}`
			: "It has no open milestones";
		throw new Error(
			`${target.owner}/${target.repo} has no open ${wanted} milestone. ${available}`,
		);
	}
	return match;
}
