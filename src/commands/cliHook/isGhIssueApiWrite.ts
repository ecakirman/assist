import { isGhGraphqlIssueMutation } from "./isGhGraphqlIssueMutation";

const WRITE_METHODS = new Set(["POST", "PATCH", "PUT", "DELETE"]);
const METHOD = /(?:-X|--method)[\s=]*["']?([A-Za-z]+)/g;
const BODY_FLAG = /\s(?:-[fF]|--field|--raw-field|--input)/;
const ISSUE_ENDPOINT = /repos\/[^/\s"'`]+\/[^/\s"'`]+\/issues(?:$|[/?\s"'`)])/;

export function isGhIssueApiWrite(command: string): boolean {
	if (!/gh\s+api/.test(command)) return false;
	if (ISSUE_ENDPOINT.test(command) && isWrite(command)) return true;
	return isGhGraphqlIssueMutation(command);
}

function isWrite(command: string): boolean {
	const methods = [...command.matchAll(METHOD)].map((m) => m[1].toUpperCase());
	if (methods.length > 0) return methods.some((m) => WRITE_METHODS.has(m));
	return BODY_FLAG.test(command);
}
