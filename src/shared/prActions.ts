export const prActions: { label: string; args: string[] }[] = [
	{ label: "Checkout", args: ["review", "--checkout-only"] },
	{ label: "Address Comments", args: ["review-pr-comments"] },
	{ label: "Fix conflicts (merge)", args: ["fix-conflict"] },
	{ label: "Fix conflicts (rebase)", args: ["fix-conflict", "--rebase"] },
];
