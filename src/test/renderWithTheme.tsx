import type { PaletteMode } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { render, type RenderOptions } from "@testing-library/react";
import { Fragment, type ReactNode } from "react";
import { createDesignTheme } from "../commands/sessions/web/ui/designSystem/createDesignTheme";

export function renderWithTheme(
	ui: ReactNode,
	options: RenderOptions & { mode?: PaletteMode } = {},
) {
	const { mode = "light", wrapper: Inner = Fragment, ...rest } = options;
	const theme = createDesignTheme(mode);
	return render(ui, {
		...rest,
		wrapper: ({ children }) => (
			<ThemeProvider theme={theme}>
				<Inner>{children}</Inner>
			</ThemeProvider>
		),
	});
}
