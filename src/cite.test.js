import { assert } from 'chai';
import { browser, EXTENSION_ID } from '../setupTests';

describe('Cite Creator', () => {
	it('Correctly computes a cite', async () => {
		// The test HTML page loads the cite.js script and a test shim that mocks the browser storage API
		// That lets us set the extension to enabled on page load and control the mock from the page context
		// because Node otherwise can't access the browser object. There's probably a way to do it with
		// Node and write more comprehensive tests with different settings states, but that's a lot harder
		const page = await browser.newPage();
		const url = `chrome-extension://${EXTENSION_ID}/test.html`;
		await page.goto(url);

		await page.waitForSelector('#cite-content');
		const cite = await page.$eval('#cite-content', (el) => el.innerText);
		assert.strictEqual(
			cite,
			`Test Author, 1-1-2000, "Test Title", Test Publication, ${url}`,
			'Correctly computed cite',
		);

		await page.click('#cite-min');
		let display = await page.$eval(
			'#cite-content',
			(el) => window.getComputedStyle(el).display,
		);
		assert.strictEqual(display, 'none', 'Minimized cite');

		await page.click('#cite-min');
		display = await page.$eval(
			'#cite-content',
			(el) => window.getComputedStyle(el).display,
		);
		assert.strictEqual(display, 'block', 'Restored cite');

		await page.click('#cite-close');
		display = await page.$eval(
			'#cite-container',
			(el) => window.getComputedStyle(el).display,
		);
		assert.strictEqual(display, 'none', 'Closed cite');
	});
});
