const passthrough = [
	"PATH",
	"TERM",
	"LANG",
	"SHELL",
	"TMPDIR",
	"SystemRoot",
	"ComSpec",
	"PATHEXT",
	"WINDIR",
];

export function isolatedEnv(
	home: string,
	source: NodeJS.ProcessEnv = process.env,
): NodeJS.ProcessEnv {
	const env: NodeJS.ProcessEnv = {};
	for (const key of passthrough) if (source[key]) env[key] = source[key];
	return {
		...env,
		HOME: home,
		USERPROFILE: home,
		XDG_CONFIG_HOME: `${home}/.config`,
		GIT_CONFIG_NOSYSTEM: "1",
		BROWSER: "none",
	};
}
