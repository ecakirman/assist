import semver from "semver";

export function supersedesUpdate(
	version: string,
	listed: string | undefined,
): boolean {
	return listed === undefined || semver.gt(version, listed);
}
