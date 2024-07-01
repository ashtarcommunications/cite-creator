const toCamelCase = (str) =>
	str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

const positionHandler = (e) => {
	browser.storage.sync.set({
		position: e.target.value || 'right',
	});
};

const checkboxHandler = (e) => {
	browser.storage.sync.set({
		[toCamelCase(e.target.id)]: e.target.checked,
	});
};

const citeFormatHandler = () => {
	const citeFormat = document.querySelector(
		'input[name="cite-format"]:checked',
	).value;

	browser.storage.sync.set({ citeFormat });
	document.getElementById('custom-cite-format').disabled =
		citeFormat !== 'custom';
};

const customCiteFormatHandler = (e) => {
	browser.storage.sync.set({
		customCiteFormat: e.target.value,
	});
};

const shortcutHandler = (e) => {
	browser.storage.sync.set({
		[toCamelCase(e.target.id)]: e.target.value
			.toLowerCase()
			.replace(' ', '')
			.trim(),
	});
};

document.addEventListener('DOMContentLoaded', async () => {
	const { version } = browser.runtime.getManifest();
	document.getElementById('version').innerText = `v${version}`;

	const settings = await browser.storage.sync.get(null);

	document.getElementById('enabled').checked = !!settings.enabled;

	document.getElementById('position').value = settings.position || 'right';

	document.getElementById('copy-selected').checked = !!settings.copySelected;
	document.getElementById('suppress-rating').checked =
		!!settings.suppressRating;
	document.getElementById('use-slashes').checked = !!settings.useSlashes;
	document.getElementById('large-font').checked = !!settings.largeFont;
	document.getElementById('debug-mode').checked = !!settings.debugMode;

	switch (settings.citeFormat) {
		case 'frontloaded':
			document.getElementById('cite-format-frontloaded').checked = true;
			document.getElementById('custom-cite-format').disabled = true;
			break;
		case 'twoline':
			document.getElementById('cite-format-twoline').checked = true;
			document.getElementById('custom-cite-format').disabled = true;
			break;
		case 'custom':
			document.getElementById('cite-format-custom').checked = true;
			document.getElementById('custom-cite-format').disabled = false;
			break;
		default:
			document.getElementById('cite-format-standard').checked = true;
			document.getElementById('custom-cite-format').disabled = true;
			break;
	}

	document.getElementById('custom-cite-format').value =
		settings.customCiteFormat || '';

	document.getElementById('shortcut-copy').value = settings.shortcutCopy || '';
	document.getElementById('shortcut-author').value =
		settings.shortcutAuthor || '';
	document.getElementById('shortcut-quals').value =
		settings.shortcutQuals || '';
	document.getElementById('shortcut-date').value = settings.shortcutDate || '';
	document.getElementById('shortcut-title').value =
		settings.shortcutTitle || '';
	document.getElementById('shortcut-publication').value =
		settings.shortcutPublication || '';

	document
		.getElementById('enabled')
		.addEventListener('change', checkboxHandler);

	document
		.getElementById('position')
		.addEventListener('change', positionHandler);

	document
		.getElementById('copy-selected')
		.addEventListener('change', checkboxHandler);
	document
		.getElementById('suppress-rating')
		.addEventListener('change', checkboxHandler);
	document
		.getElementById('use-slashes')
		.addEventListener('change', checkboxHandler);
	document
		.getElementById('large-font')
		.addEventListener('change', checkboxHandler);
	document
		.getElementById('debug-mode')
		.addEventListener('change', checkboxHandler);

	const formats = document.getElementsByName('cite-format');

	for (let i = 0; i < formats.length; i++) {
		formats[i].addEventListener('click', citeFormatHandler, false);
	}
	document
		.getElementById('custom-cite-format')
		.addEventListener('input', customCiteFormatHandler);

	document
		.getElementById('shortcut-copy')
		.addEventListener('input', shortcutHandler);
	document
		.getElementById('shortcut-author')
		.addEventListener('input', shortcutHandler);
	document
		.getElementById('shortcut-quals')
		.addEventListener('input', shortcutHandler);
	document
		.getElementById('shortcut-date')
		.addEventListener('input', shortcutHandler);
	document
		.getElementById('shortcut-title')
		.addEventListener('input', shortcutHandler);
	document
		.getElementById('shortcut-publication')
		.addEventListener('input', shortcutHandler);
});
