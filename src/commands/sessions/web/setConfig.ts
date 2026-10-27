import type { IncomingMessage, ServerResponse } from "node:http";
import { applyDbBackedConfigWrite } from "../../config/applyDbBackedConfigWrite";
import { coerceConfigValue } from "../../config/coerceConfigValue";
import { isDbBackedConfigKey } from "../../config/dbBackedConfigKeys";
import { restoreConfigWriteSecrets } from "../../config/restoreConfigWriteSecrets";
import { applyScopedConfigSet } from "./applyScopedConfigSet";
import { handleConfigWrite } from "./handleConfigWrite";

export function setConfig(
	req: IncomingMessage,
	res: ServerResponse,
): Promise<void> {
	return handleConfigWrite(req, res, (request) => {
		const coerced = coerceConfigValue(
			request.key,
			restoreConfigWriteSecrets(request.key, request.value, request.cwd),
		);
		if (!coerced.ok) return { ok: false, errors: [coerced.error] };
		if (isDbBackedConfigKey(request.key))
			return applyDbBackedConfigWrite(request.key, request.scope, {
				value: coerced.value,
			});

		return applyScopedConfigSet(
			request.key,
			coerced.value,
			request.cwd,
			request.scope,
		);
	});
}
