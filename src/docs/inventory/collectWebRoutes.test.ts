import { describe, expect, it } from "vitest";
import { collectWebRoutes } from "./collectWebRoutes";

describe("collectWebRoutes", () => {
	it("lists route paths, trimming splats and skipping the catch-all", () => {
		const source = `
			<Route element={<AppLayout />}>
				<Route path="sessions" element={<SessionContent />} />
				<Route
					path="backlog/*"
					element={<BacklogContent />}
				/>
				<Route path="*" element={<Navigate to="/sessions" replace />} />
			</Route>`;

		expect(collectWebRoutes(source).map((item) => item.id)).toEqual([
			"route:/sessions",
			"route:/backlog",
		]);
	});
});
