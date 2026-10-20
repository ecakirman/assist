import { prCheckoutNumber } from "./prCheckoutNumber";

export function isPrCheckoutArgs(args: string[]): boolean {
	return prCheckoutNumber(args) !== undefined;
}
