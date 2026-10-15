export const reviewOptionFlags = [
	{ key: "force", label: "Force re-run", flag: "--force" },
	{
		key: "addressComments",
		label: "Address comments after",
		flag: "--address-comments",
	},
	{ key: "announce", label: "Announce to Slack after", flag: "--announce" },
] as const;

export type ReviewOptions = Record<
	(typeof reviewOptionFlags)[number]["key"],
	boolean
>;

export const reviewOptionDefaults: ReviewOptions = {
	force: false,
	addressComments: false,
	announce: false,
};

export function reviewOptionArgs(options: ReviewOptions): string[] {
	return reviewOptionFlags
		.filter(({ key }) => options[key])
		.map(({ flag }) => flag);
}
