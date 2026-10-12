import { type CommitNode, releaseCommit } from "./releaseCommit";
import type { ReleaseCommit } from "./types";

export type LiveDeployment = { commit: ReleaseCommit; at: string };

export type QueuedDeployment = LiveDeployment & { runUrl: string | null };

export type DeploymentNode = {
	environment: string | null;
	createdAt: string;
	commitOid: string | null;
	commit: CommitNode | null;
	latestStatus: {
		state: string;
		createdAt: string;
		logUrl?: string | null;
	} | null;
};

type DeploymentMaps = {
	live: Map<string, LiveDeployment>;
	queued: Map<string, QueuedDeployment>;
};

const NOT_YET_LIVE_STATES = new Set([
	"WAITING",
	"PENDING",
	"QUEUED",
	"IN_PROGRESS",
]);

function entryOf(node: DeploymentNode, sha: string): LiveDeployment {
	return {
		commit: releaseCommit(sha, node.commit),
		at: node.latestStatus?.createdAt ?? node.createdAt,
	};
}

function queuedEntryOf(node: DeploymentNode, sha: string): QueuedDeployment {
	return { ...entryOf(node, sha), runUrl: node.latestStatus?.logUrl ?? null };
}

function dropAlreadyLive(maps: DeploymentMaps): DeploymentMaps {
	for (const [environment, entry] of maps.queued)
		if (maps.live.get(environment)?.commit.sha === entry.commit.sha)
			maps.queued.delete(environment);
	return maps;
}

export function deploymentMaps(
	nodes: (DeploymentNode | null)[],
): DeploymentMaps {
	const live = new Map<string, LiveDeployment>();
	const queued = new Map<string, QueuedDeployment>();
	for (const node of nodes) {
		const state = node?.latestStatus?.state;
		if (!node?.environment || !node.commitOid || !state) continue;
		if (state === "SUCCESS") {
			live.set(node.environment, entryOf(node, node.commitOid));
			queued.delete(node.environment);
		} else if (NOT_YET_LIVE_STATES.has(state))
			queued.set(node.environment, queuedEntryOf(node, node.commitOid));
	}
	return dropAlreadyLive({ live, queued });
}
