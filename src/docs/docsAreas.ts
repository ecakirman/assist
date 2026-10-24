export const docsAreas = [
	"getting-started",
	"sessions-core",
	"sessions-diff",
	"sessions-preview",
	"linked-nodes",
	"backlog",
	"activity",
	"git-github",
	"repo-tooling",
	"integrations",
] as const;

export type DocsArea = (typeof docsAreas)[number];
