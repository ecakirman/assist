import { createContext, useContext } from "react";

export const ToastStackContext = createContext<HTMLElement | null>(null);

export function useToastStackContext(): HTMLElement | null {
	return useContext(ToastStackContext);
}
