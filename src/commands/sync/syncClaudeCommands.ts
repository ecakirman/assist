import * as fs from "node:fs";
import * as path from "node:path";
import { commandToSkill } from "./commandToSkill";

function replaceFileWithoutFollowingSymlink(
	file: string,
	content: string,
): void {
	fs.rmSync(file, { force: true });
	fs.writeFileSync(file, content);
}

function writeSkill(targetBase: string, name: string, content: string): void {
	const skillDir = path.join(targetBase, "skills", name);
	fs.mkdirSync(skillDir, { recursive: true });
	replaceFileWithoutFollowingSymlink(
		path.join(skillDir, "SKILL.md"),
		commandToSkill(name, content),
	);
	fs.rmSync(path.join(targetBase, "commands", `${name}.md`), { force: true });
}

export function syncClaudeCommands(
	claudeDir: string,
	targetBase: string,
): string[] {
	const sourceDir = path.join(claudeDir, "commands");
	const names = fs
		.readdirSync(sourceDir)
		.filter((file) => file.endsWith(".md"))
		.map((file) => path.basename(file, ".md"));

	for (const name of names) {
		const content = fs.readFileSync(path.join(sourceDir, `${name}.md`), "utf8");
		writeSkill(targetBase, name, content);
	}

	console.log(
		`Synced ${names.length} skill(s) to ${path.join(targetBase, "skills")}`,
	);

	return names;
}
