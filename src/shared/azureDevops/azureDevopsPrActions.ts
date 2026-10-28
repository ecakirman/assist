import { prActions } from "../prActions";

const SUPPORTED = new Set(["Checkout"]);

export const azureDevopsPrActions = prActions.filter(({ label }) =>
	SUPPORTED.has(label),
);
