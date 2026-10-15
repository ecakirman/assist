export function describeWork(comments: number, carried: number): string {
	const parts: string[] = [];
	if (comments > 0) parts.push(`${comments} line comment(s)`);
	if (carried > 0) parts.push(`${carried} finding(s) in the review body`);
	return parts.join(" and ");
}
