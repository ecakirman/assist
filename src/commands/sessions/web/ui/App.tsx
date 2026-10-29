import { CssBaseline, ThemeProvider } from "@mui/material";
import { useMemo } from "react";
import "react-diff-view/style/index.css";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { AppShell } from "./App/AppShell";
import { useColorMode } from "./App/useColorMode";
import { createDesignTheme } from "./designSystem/createDesignTheme";
import { loadFontsBeforeTerminalsOpen } from "./designSystem/loadFontsBeforeTerminalsOpen";
import { useDesign } from "./designSystem/useDesign";

function Root() {
	const { mode, toggle } = useColorMode();
	const { design, toggleDesign } = useDesign();
	const theme = useMemo(() => createDesignTheme(design, mode), [design, mode]);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AppShell mode={mode} toggle={toggle} toggleDesign={toggleDesign} />
		</ThemeProvider>
	);
}

const dataRouterForNavigationBlocking = createBrowserRouter([
	{ path: "*", element: <Root /> },
]);

export function App() {
	return <RouterProvider router={dataRouterForNavigationBlocking} />;
}

const root = document.getElementById("app");
if (root) {
	void loadFontsBeforeTerminalsOpen().then(() => {
		createRoot(root).render(<App />);
	});
}
