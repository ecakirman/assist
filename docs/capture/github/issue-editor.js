const body = [
	"Sort the bullets under Nonsense alphabetically.",
	"",
	"## Acceptance criteria",
	"",
	"1. The Nonsense list is sorted alphabetically",
	"   1. Sorting ignores case",
	"   2. Leading articles are kept",
	"2. No other README section changes",
].join("\n");

const form = document.createElement("form");
form.dataset.testid = "capture-issue-editor";
form.className = "Box p-2";
form.style.width = "720px";
form.innerHTML = `
	<div role="toolbar" class="d-flex flex-items-center gap-2 p-1 border-bottom mb-2">
		<button type="button" class="btn-octicon"><b>B</b></button>
		<button type="button" class="btn-octicon"><i>I</i></button>
		<button type="button" class="btn-octicon">&lt;/&gt;</button>
	</div>
	<textarea class="form-control width-full" rows="10" placeholder="Type your description here…"></textarea>
`;
form.querySelector("textarea").value = body;
const issueBody = document.querySelector('[data-testid="issue-body"]');
issueBody.style.display = "none";
issueBody.after(form);
