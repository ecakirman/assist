export type VerifyEntry = {
	name: string;
	fullCommand: string;
	cwd?: string;
	env?: Record<string, string>;
	filter?: string;
	outsideRoots?: string[];
	quiet?: boolean;
};
