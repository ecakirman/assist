const dialog = document.createElement("dialog");
dialog.className = "assist-lightbox";
const image = document.createElement("img");
dialog.append(image);
document.body.append(dialog);

dialog.addEventListener("click", () => dialog.close());

document.addEventListener("click", (event) => {
	if (!(event.target instanceof Element)) return;
	const link = event.target.closest<HTMLAnchorElement>(
		".sl-markdown-content figure a",
	);
	if (!link) return;
	const thumbnail = link.querySelector("img");
	if (!thumbnail) return;
	event.preventDefault();
	image.src = link.href;
	image.alt = thumbnail.alt;
	dialog.showModal();
});
