#!/usr/bin/env node
import { createProgram } from "./createProgram";
import { reportCliError } from "./reportCliError";
import { closeDb } from "./shared/db/getDb";

createProgram()
	.parseAsync()
	.catch(reportCliError)
	.finally(() => closeDb());
