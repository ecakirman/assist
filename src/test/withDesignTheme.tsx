import { ThemeProvider } from "@mui/material/styles";
import { Fragment, type JSXElementConstructor, type ReactNode } from "react";
import { createDesignTheme } from "../commands/sessions/web/ui/designSystem/createDesignTheme";

type Wrapper = JSXElementConstructor<{ children: ReactNode }>;

const theme = createDesignTheme("light");

export function withDesignTheme(Inner: Wrapper = Fragment): Wrapper {
	return ({ children }) => (
		<ThemeProvider theme={theme}>
			<Inner>{children}</Inner>
		</ThemeProvider>
	);
}
