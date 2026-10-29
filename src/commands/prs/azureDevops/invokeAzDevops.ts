import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export type AzDevopsRequest = {
	org: string;
	resource: string;
	routeParameters: Record<string, string | number>;
	method?: "GET" | "POST" | "PATCH";
	body?: unknown;
};

export function azDevopsInvokeArgs(
	request: AzDevopsRequest,
	inFile?: string,
): string[] {
	return [
		"devops",
		"invoke",
		"--area",
		"git",
		"--resource",
		request.resource,
		"--route-parameters",
		...Object.entries(request.routeParameters).map(
			([key, value]) => `${key}=${value}`,
		),
		"--org",
		`https://dev.azure.com/${request.org}`,
		"--api-version",
		"7.1",
		"--http-method",
		request.method ?? "GET",
		...(inFile ? ["--in-file", inFile] : []),
		"--only-show-errors",
		"-o",
		"json",
	];
}

function runAz(args: string[]): unknown {
	const stdout = execFileSync("az", args, {
		encoding: "utf8",
		stdio: ["ignore", "pipe", "pipe"],
		windowsHide: true,
	});
	return stdout.trim() ? JSON.parse(stdout) : null;
}

export function invokeAzDevops(request: AzDevopsRequest): unknown {
	if (request.body === undefined) return runAz(azDevopsInvokeArgs(request));
	const dir = mkdtempSync(join(tmpdir(), "assist-az-"));
	const inFile = join(dir, "body.json");
	try {
		writeFileSync(inFile, JSON.stringify(request.body));
		return runAz(azDevopsInvokeArgs(request, inFile));
	} finally {
		rmSync(dir, { recursive: true, force: true });
	}
}
