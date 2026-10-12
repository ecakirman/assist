export function pullRequestsQuery(shas: string[]): string {
	const lookups = shas.map(
		(sha, index) =>
			`c${index}: object(oid:${JSON.stringify(sha)}){ ... on Commit { associatedPullRequests(first:5){ nodes{ number title url author{ login } mergeCommit{ oid } } } } }`,
	);
	return `query($owner:String!,$name:String!){
  repository(owner:$owner,name:$name){ ${lookups.join(" ")} }
}`;
}
