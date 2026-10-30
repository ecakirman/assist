import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { lastAssistRepo } from "./lastAssistRepo";
import { requestAssistClones } from "./requestAssistClones";

export function AssistRepoPicker({
	value,
	onChange,
}: {
	value: string;
	onChange: (repo: string) => void;
}) {
	const [clones, setClones] = useState<string[]>();
	const [error, setError] = useState<string>();

	useEffect(() => {
		let active = true;
		void Promise.all([requestAssistClones(), lastAssistRepo.load()]).then(
			([result, last]) => {
				if (!active) return;
				if (!result.ok) return setError(result.message);
				setClones(result.clones);
				if (last && result.clones.includes(last)) onChange(last);
			},
		);
		return () => {
			active = false;
		};
	}, [onChange]);

	return (
		<TextField
			select
			fullWidth
			size="small"
			sx={{ mt: 1 }}
			value={value}
			onChange={(event) => {
				lastAssistRepo.save(event.target.value);
				onChange(event.target.value);
			}}
			error={Boolean(error)}
			helperText={error}
			slotProps={{
				select: { native: true },
				htmlInput: { "aria-label": "Repo for assist" },
			}}
		>
			<option value="">{clones ? "Pick a repo" : "Loading repos…"}</option>
			{clones?.map((clone) => (
				<option key={clone} value={clone}>
					{clone}
				</option>
			))}
		</TextField>
	);
}
