import { mkdtempSync, utimesSync, writeFileSync } from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { describe, expect, it } from "vitest";
import { createBundleHandler } from "./createBundleHandler";

function createRes() {
	let statusCode = 0;
	let headers: Record<string, string> = {};
	let body: Buffer | undefined;
	const res = {
		writeHead: (status: number, h: Record<string, string>) => {
			statusCode = status;
			headers = h;
			return res;
		},
		end: (chunk?: Buffer) => {
			body = chunk;
			return res;
		},
	} as unknown as ServerResponse;
	return {
		res,
		status: () => statusCode,
		headers: () => headers,
		body: () => body?.toString("utf8"),
		bytes: () => body,
	};
}

function createHandler(
	contents: string | Buffer,
	name = "bundle.js",
	contentType?: string,
) {
	const dir = mkdtempSync(join(tmpdir(), "bundle-"));
	const file = join(dir, name);
	writeFileSync(file, contents);
	const importMetaUrl = pathToFileURL(join(dir, "handler.js")).href;
	return Object.assign(createBundleHandler(importMetaUrl, name, contentType), {
		rebuild: (next: string) => {
			writeFileSync(file, next);
			utimesSync(file, new Date(), new Date(Date.now() + 1000));
		},
	});
}

describe("createBundleHandler", () => {
	it("serves the bundle with a content-hashed ETag and no-cache", () => {
		const handler = createHandler("console.log('hi')");
		const { res, status, headers, body } = createRes();

		handler({ headers: {} } as IncomingMessage, res);

		expect(status()).toBe(200);
		expect(body()).toBe("console.log('hi')");
		expect(headers()["Cache-Control"]).toBe("no-cache");
		expect(headers().ETag).toMatch(/^"[0-9a-f]{16}"$/);
	});

	describe("when the request's If-None-Match matches the current bundle", () => {
		it("responds 304 with no body so the browser reuses its cached copy", () => {
			const handler = createHandler("console.log('hi')");
			const first = createRes();
			handler({ headers: {} } as IncomingMessage, first.res);
			const etag = first.headers().ETag;

			const second = createRes();
			handler(
				{ headers: { "if-none-match": etag } } as unknown as IncomingMessage,
				second.res,
			);

			expect(second.status()).toBe(304);
			expect(second.body()).toBeUndefined();
		});
	});

	describe("when the bundle is rebuilt while the server keeps running", () => {
		it("serves the new bundle instead of the copy cached in memory", () => {
			const handler = createHandler("console.log('old')");
			const first = createRes();
			handler({ headers: {} } as IncomingMessage, first.res);
			const staleEtag = first.headers().ETag;

			handler.rebuild("console.log('new')");
			const second = createRes();
			handler(
				{
					headers: { "if-none-match": staleEtag },
				} as unknown as IncomingMessage,
				second.res,
			);

			expect(second.status()).toBe(200);
			expect(second.body()).toBe("console.log('new')");
			expect(second.headers().ETag).not.toBe(staleEtag);
		});
	});

	describe("when the request's If-None-Match is stale", () => {
		it("serves the full current bundle", () => {
			const handler = createHandler("console.log('hi')");
			const { res, status, body } = createRes();

			handler(
				{
					headers: { "if-none-match": '"deadbeefdeadbeef"' },
				} as unknown as IncomingMessage,
				res,
			);

			expect(status()).toBe(200);
			expect(body()).toBe("console.log('hi')");
		});
	});

	describe("when serving a binary file such as a PNG icon", () => {
		const png = Buffer.from([
			0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0xff, 0xfe, 0x80,
		]);

		it("returns the bytes unchanged with the given content type", () => {
			const handler = createHandler(png, "icon.png", "image/png");
			const { res, status, headers, bytes } = createRes();

			handler({ headers: {} } as IncomingMessage, res);

			expect(status()).toBe(200);
			expect(headers()["Content-Type"]).toBe("image/png");
			expect(bytes()?.equals(png)).toBe(true);
		});

		it("responds 304 when If-None-Match matches", () => {
			const handler = createHandler(png, "icon.png", "image/png");
			const first = createRes();
			handler({ headers: {} } as IncomingMessage, first.res);

			const second = createRes();
			handler(
				{
					headers: { "if-none-match": first.headers().ETag },
				} as unknown as IncomingMessage,
				second.res,
			);

			expect(second.status()).toBe(304);
			expect(second.bytes()).toBeUndefined();
		});
	});
});
