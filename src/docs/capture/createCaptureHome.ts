import {
	copyFileSync,
	cpSync,
	mkdtempSync,
	realpathSync,
	writeFileSync,
} from "node:fs";
import type { Server } from "node:http";
import type { Socket } from "node:net";
import { tmpdir } from "node:os";
import { delimiter, join } from "node:path";
import type { CaptureNewsFeed } from "../captureSetupStepSchema";
import { docsPaths } from "../docsPaths";
import { cloneCaptureRepos } from "./cloneCaptureRepos";
import { isolatedEnv } from "./isolatedEnv";

type CapturePeer = {
	capture: CaptureHome;
	url: string;
	stop: () => Promise<void>;
};

export type CaptureHome = {
	home: string;
	reposDir: string;
	sandbox: string;
	env: NodeJS.ProcessEnv;
	databaseUrl: string;
	sessionIds: Map<string, string>;
	openPreviews: Socket[];
	peers: Map<string, CapturePeer>;
	linkedPeers: Set<string>;
	newsFeeds: Map<string, CaptureNewsFeed>;
	feedServer?: Server;
};

function socketPathSafeTempDir(): string {
	return process.platform === "win32" ? tmpdir() : "/tmp";
}

export function createCaptureHome(databaseUrl: string): CaptureHome {
	const home = realpathSync(
		mkdtempSync(join(socketPathSafeTempDir(), "assist-docs-")),
	);
	const bin = join(home, "bin");
	cpSync(docsPaths.captureBin, bin, { recursive: true });
	const base = isolatedEnv(home);
	const env = {
		...base,
		PATH: [bin, base.PATH].filter(Boolean).join(delimiter),
		ASSIST_DATABASE_URL: databaseUrl,
	};
	copyFileSync(docsPaths.captureConfig, join(home, ".assist.yml"));
	writeFileSync(
		join(home, ".gitconfig"),
		"[user]\n\tname = Sandbox\n\temail = sandbox@example.com\n",
	);
	const reposDir = join(home, "repos");
	const sandbox = cloneCaptureRepos(reposDir, env);
	return {
		home,
		reposDir,
		sandbox,
		env,
		databaseUrl,
		sessionIds: new Map(),
		openPreviews: [],
		peers: new Map(),
		linkedPeers: new Set(),
		newsFeeds: new Map(),
	};
}
