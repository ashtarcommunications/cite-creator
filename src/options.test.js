import { assert } from 'chai';
import { browser, EXTENSION_ID } from '../setupTests';

describe('Cite Creator Options', () => {
	it('Renders an options page', async () => {
		const page = await browser.newPage();
		await page.goto(`chrome-extension://${EXTENSION_ID}/options.html`);

		let enabled = await page.$eval('#enabled', (el) => el.checked);
		assert.isFalse(enabled, 'Toggle is off by default');
		await page.click('.switch');
		enabled = await page.$eval('#enabled', (el) => el.checked);
		assert.isTrue(enabled, 'Toggle is on');

		let copySelected = await page.$eval('#copy-selected', (el) => el.checked);
		assert.isFalse(copySelected, 'Copy Selected is off by default');
		await page.click('#copy-selected');
		copySelected = await page.$eval('#copy-selected', (el) => el.checked);
		assert.isTrue(copySelected, 'Copy Selected is on');

		let position = await page.$eval('#position', (el) => el.value);
		assert.strictEqual(position, 'right', 'Position is right by default');
		await page.select('#position', 'left');
		position = await page.$eval('#position', (el) => el.value);
		assert.strictEqual(position, 'left', 'Position is set to left');

		let disabled = await page.$eval('#custom-cite-format', (el) => el.disabled);
		assert.isTrue(disabled, 'Custom cite format is disabled by default');
		await page.click('#cite-format-custom');
		disabled = await page.$eval('#custom-cite-format', (el) => el.disabled);
		assert.isFalse(disabled, 'Custom cite format is enabled');
		await page.type('#custom-cite-format', '%author%');
		const customCiteFormat = await page.$eval(
			'#custom-cite-format',
			(el) => el.value,
		);
		assert.strictEqual(
			customCiteFormat,
			'%author%',
			'Custom cite format is set correctly',
		);

		await page.type('#shortcut-copy', 'ctrl+1');
		const shortcutCopy = await page.$eval('#shortcut-copy', (el) => el.value);
		assert.strictEqual(
			shortcutCopy,
			'ctrl+1',
			'Shortcut copy is set correctly',
		);
	});
});
