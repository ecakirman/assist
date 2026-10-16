import { execFileSync } from "node:child_process";

type ThreadNode = {
	id: string;
	isResolved: boolean;
	comments: {
		nodes: { databaseId: number }[];
	};
};

type GraphQLResponse = {
	data: {
		repository: {
			pullRequest: {
				reviewThreads: {
					nodes: ThreadNode[];
				};
			};
		};
	};
};

export type ThreadInfo = {
	threadMap: Map<number, string>;
	resolvedThreadIds: Set<string>;
};

const THREAD_QUERY = `query($owner: String!, $repo: String!, $prNumber: Int!) { repository(owner: $owner, name: $repo) { pullRequest(number: $prNumber) { reviewThreads(first: 100) { nodes { id isResolved comments(first: 100) { nodes { databaseId } } } } } } }`;

export function fetchThreadIds(
	org: string,
	repo: string,
	prNumber: number,
): ThreadInfo {
	const result = execFileSync(
		"gh",
		[
			"api",
			"graphql",
			"-f",
			`query=${THREAD_QUERY}`,
			"-F",
			`owner=${org}`,
			"-F",
			`repo=${repo}`,
			"-F",
			`prNumber=${prNumber}`,
		],
		{ encoding: "utf8" },
	);

	const response: GraphQLResponse = JSON.parse(result);
	const threadMap = new Map<number, string>();
	const resolvedThreadIds = new Set<string>();

	for (const thread of response.data.repository.pullRequest.reviewThreads
		.nodes) {
		if (thread.isResolved) {
			resolvedThreadIds.add(thread.id);
		}
		for (const comment of thread.comments.nodes) {
			threadMap.set(comment.databaseId, thread.id);
		}
	}

	return { threadMap, resolvedThreadIds };
}
