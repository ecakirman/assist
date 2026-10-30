import { getCurrentOrigin } from "../../../backlog/getCurrentOrigin";
import { listClones } from "./listClones";

export function findCloneByOrigin(
	origin: string,
	baseDir: string,
): string | undefined {
	return listClones(baseDir).find((dir) => getCurrentOrigin(dir) === origin);
}
