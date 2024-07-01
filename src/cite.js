/* eslint-disable no-restricted-syntax */
/* eslint-disable no-useless-escape */
const cite = {
	name: 'No Author',
	first: '',
	last: '',
	quals: '',
	date: '',
	year: 'xxxx',
	shortYear: 'xx',
	month: 'xx',
	day: 'xx',
	title: '',
	publication: '',
};
let rating = 0;

const log = (string) => {
	// eslint-disable-next-line no-console
	console.log(string);
};

const nthOccurrence = (string, char, nth) => {
	const firstIndex = string.indexOf(char);
	const lengthUpToFirstIndex = firstIndex + 1;

	if (nth === 1) {
		return firstIndex;
	}

	const stringAfterFirstOccurrence = string.slice(lengthUpToFirstIndex);
	const nextOccurrence = nthOccurrence(
		stringAfterFirstOccurrence,
		char,
		nth - 1,
	);

	if (nextOccurrence === -1) {
		return -1;
	}

	return lengthUpToFirstIndex + nextOccurrence;
};

const toTitleCase = (str) => {
	return str.replace(/\w*/g, (txt) => {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

const ratingToColor = (numberRating) => {
	if (numberRating >= 5) return 'cite-green';
	if (numberRating === 4 || numberRating === 3) return 'cite-yellow';
	return 'cite-red';
};

const ratingToGrade = (numberRating) => {
	if (numberRating >= 7) return 'A';
	if (numberRating === 6) return 'A-';
	if (numberRating === 5) return 'B';
	if (numberRating === 4) return 'B-';
	if (numberRating === 3) return 'C';
	if (numberRating === 2) return 'C-';
	if (numberRating === 1) return 'D';
	if (numberRating === 0) return 'D-';
	return 'F';
};

const minimizeCite = () => {
	const citeContent = document.getElementById('cite-content');
	citeContent.classList.toggle('cite-hidden');
	document.getElementById('cite-min').textContent =
		citeContent.classList.includes('cite-hidden') ? '+' : '–';
};

const closeCite = () => {
	document.getElementById('cite-container').classList.add('cite-hidden');
};

const removeCite = () => {
	const div = document.getElementById('cite-container');
	if (div) {
		document.body.removeChild(div);
	}
};

const displayCite = async () => {
	removeCite();
	const settings = await browser.storage.sync.get(null);
	const separator = settings.useSlashes ? '/' : '-';

	let fullCite;
	const today = new Date();

	switch (settings.citeFormat) {
		case 'frontloaded': // Frontloaded
			// Don't print publication if it's the same as the name
			if (cite.name === cite.publication) {
				fullCite = `${cite.name} ${cite.shortYear}, ${cite.quals}, ${cite.month}${separator}${cite.day}${separator}${cite.year}, "${cite.title}", ${document.URL}`;
			} else {
				fullCite = `${cite.name} ${cite.shortYear}, ${cite.quals}, ${cite.month}${separator}${cite.day}${separator}${cite.year}, "${cite.title}", ${cite.publication}, ${document.URL}`;
			}
			break;
		case 'twoline': // Two-line
			if (cite.name === cite.publication) {
				fullCite = `${cite.last} ${cite.shortYear}\n(${cite.name}, ${cite.quals}, ${cite.month}${separator}${cite.day}${separator}${cite.year}, "${cite.title}", ${document.URL})`;
			} else {
				fullCite = `${cite.last} ${cite.shortYear}\n(${cite.name}, ${cite.quals}, ${cite.month}${separator}${cite.day}${separator}${cite.year}, "${cite.title}", ${cite.publication}, ${document.URL})`;
			}
			break;
		case 'custom': // Custom
			fullCite = settings.customCiteFormat;

			if (cite.name === cite.publication) {
				fullCite = fullCite.replace('%publication%', '');
			}

			fullCite = fullCite.replace(/%author%/g, cite.name);
			fullCite = fullCite.replace(/%first%/g, cite.first);
			fullCite = fullCite.replace(/%last%/g, cite.last);
			fullCite = fullCite.replace(/%y%/g, cite.shortYear);
			fullCite = fullCite.replace(/%quals%/g, cite.quals);
			fullCite = fullCite.replace(
				/%date%/g,
				`${cite.month}-${cite.day}-${cite.year}`,
			);
			fullCite = fullCite.replace(/%title%/g, cite.title);
			fullCite = fullCite.replace(/%publication%/g, cite.publication);
			fullCite = fullCite.replace(/%url%/g, document.URL);
			fullCite = fullCite.replace(/%linebreak%/g, '\n');

			fullCite = fullCite.replace(
				/%accessed%/g,
				`${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`,
			);
			break;
		default: // Standard
			if (cite.name === cite.publication) {
				fullCite = `${cite.name}, ${cite.quals}, ${cite.month}${separator}${cite.day}${separator}${cite.year}, "${cite.title}", ${document.URL}`;
			} else {
				fullCite = `${cite.name}, ${cite.quals}, ${cite.month}${separator}${cite.day}${separator}${cite.year}, "${cite.title}", ${cite.publication}, ${document.URL}`;
			}
			break;
	}

	fullCite = fullCite.replace(', --', ', '); // Fix empty month/day
	fullCite = fullCite.replace(', //', ', ');
	fullCite = fullCite.replace(/,,/g, ',');
	fullCite = fullCite.replace(/, ,/g, ',');
	fullCite = fullCite.replace(/ , /g, ' ');

	if (settings.debugMode) {
		log(`[Cite Creator] Computed cite:\n${fullCite}`);
	}

	const div = document.createElement('div');
	div.id = 'cite-container';

	if (settings.position === 'left') {
		div.className += 'cite-container-left';
	} else if (settings.position === 'top') {
		div.className += 'cite-container-top';
	} else if (settings.position === 'bottom') {
		div.className += 'cite-container-bottom';
	} else {
		div.className += 'cite-container-right';
	}

	if (document.body.firstChild) {
		document.body.insertBefore(div, document.body.firstChild);
	} else {
		document.body.appendChild(div);
	}

	// Set div innerHTML
	div.innerHTML =
		'<div id="cite-close">&times;</div><div id="cite-min">&ndash;</div>';

	// Include rating unless Suppress Rating is set
	if (!settings.suppressRating) {
		div.innerHTML += `<div id="cite-rating" class="${ratingToColor(
			rating,
		)}"><span>${ratingToGrade(rating)}</span></div>`;
	}
	div.innerHTML += `<br /><div id="cite-content">${fullCite}</div>`;

	// If large font is set, override font size
	if (settings.largeFont) {
		document.getElementById('cite-content').classList.add('cite-large-font');
		document.getElementById('cite-rating').classList.add('cite-large-font');
	}

	// Add a listener for close and minimize buttons
	document
		.getElementById('cite-min')
		.addEventListener('click', minimizeCite, false);

	document
		.getElementById('cite-close')
		.addEventListener('click', closeCite, false);
};

const configureHotkeys = async () => {
	const settings = await browser.storage.sync.get(null);

	let modifierKey = 'alt';
	if (window.navigator.userAgentData) {
		// For newer browsers
		const { brands } = window.navigator.userAgentData;
		const isMac = brands.some((brand) =>
			brand.brand.toLowerCase().includes('mac'),
		);
		if (isMac) {
			modifierKey = 'option';
		}
	} else if (window.navigator.platform) {
		// For older browsers
		if (window.navigator.platform.indexOf('Mac') > -1) {
			modifierKey = 'option';
		}
	}

	hotkeys(settings.shortcutCopy || `ctrl+${modifierKey}+c`, () => {
		const copyDiv = document.getElementById('cite-content');

		// Flash the cite text for 300ms to show it's being copied
		copyDiv.style.color = 'blue';
		setTimeout(() => {
			copyDiv.style.color = 'white';
		}, 300);

		const sel = window.getSelection().toString();

		// If option set, get selected text
		if (settings.copySelected && sel.length > 0) {
			navigator.clipboard.writeText(`${copyDiv.innerText}\n${sel}`);
		} else {
			navigator.clipboard.writeText(copyDiv.innerText);
		}

		return false;
	});

	hotkeys(settings.shortcutAuthor || `ctrl+${modifierKey}+1`, () => {
		let name = window.getSelection().toString().trim();
		if (name.length > 0) {
			name = toTitleCase(name);
			name = name.replace(' And ', ' and ');

			cite.name = name;
			displayCite();
		}
	});

	hotkeys(settings.shortcutQuals || `ctrl+${modifierKey}+2`, () => {
		const quals = window.getSelection().toString().trim();
		if (quals.length > 0) {
			cite.quals = quals;
			displayCite();
		}
	});

	hotkeys(settings.shortcutDate || `ctrl+${modifierKey}+3`, () => {
		const date = window.getSelection().toString().trim();

		if (date.length > 0) {
			cite.date = date;

			// If only a year, manually assign month/day to stop parser thinking it's today
			if (
				date.length === 4 &&
				(date.startsWith('19') || date.startsWith('20'))
			) {
				cite.year = date;
				cite.shortYear = date.slice(-2);
				cite.month = '';
				cite.day = '';
			} else {
				const timestamp = Date.parse(date);
				if (!Number.isNaN(timestamp)) {
					const d = new Date(timestamp);
					cite.year = d.getFullYear().toString();
					cite.shortYear = cite.year.slice(-2);
					cite.month = (d.getMonth() + 1).toString(); // getMonth returns 0-11
					cite.day = d.getDate().toString();
				} else {
					cite.year = '';
					cite.shortYear = '';
					cite.month = '';
					cite.day = '';
				}
			}

			displayCite();
		}
	});

	hotkeys(settings.shortcutTitle || `ctrl+${modifierKey}+4`, () => {
		const title = window.getSelection().toString().trim();
		if (title.length > 0) {
			cite.title = toTitleCase(title);
			displayCite();
		}
	});

	hotkeys(settings.shortcutPublication || `ctrl+${modifierKey}+5`, () => {
		const publication = window.getSelection().toString().trim();
		if (publication.length > 0) {
			cite.publication = toTitleCase(publication);
			displayCite();
		}
	});
};

const computeName = () => {
	let name = '';

	// Try most common author tags
	const authorTags = [
		'author',
		'Author',
		'sailthru.author',
		'byl',
		'byline',
		'DC.creator',
	];
	for (const tag of authorTags) {
		const authors = document.getElementsByName(tag);
		if (authors.length > 0) {
			name = authors[0].content;
			break;
		}
	}

	// Try author meta tag
	if (!name) {
		const meta = document.getElementsByTagName('meta');
		for (let i = 0; i < meta.length; i++) {
			if (meta[i].getAttribute('name') === 'ces:authors') {
				name = meta[i].content;
			}
		}
	}

	// Try exact match byline or author div
	if (!name) {
		rating -= 1;
		for (const tag of authorTags) {
			const authors = document.getElementsByClassName(tag);
			if (authors.length > 0) {
				name = authors[0].innerText.trim();
				break;
			}
		}
	}

	// Try any div with "author" or "byline" in part of the id or classname
	if (!name) {
		rating -= 1;
		const divs = document.getElementsByTagName('div');
		for (let i = 0; i < divs.length; i++) {
			if (
				divs[i].id.search(/author/i) > -1 ||
				divs[i].className.search(/author/i) > -1 ||
				divs[i].id.search(/byline/i) > -1 ||
				divs[i].className.search(/byline/i) > -1
			) {
				name = divs[i].innerText.trim();
				break;
			}
		}
	}

	// Same thing with spans
	if (!name) {
		rating -= 1;
		const spans = document.getElementsByTagName('span');
		for (let i = 0; i < spans.length; i++) {
			if (
				spans[i].id.search(/author/i) > -1 ||
				spans[i].className.search(/author/i) > -1 ||
				spans[i].id.search(/byline/i) > -1 ||
				spans[i].className.search(/byline/i) > -1
			) {
				name = spans[i].innerText.trim();
				break;
			}
		}
	}

	// Try manual byline search
	if (!name) {
		rating -= 1;

		// Byline usually occurs in the first 1000 characters of the body
		const body = document.body.innerText.slice(0, 1000);

		let n = body.search(/\bby \b/i); // Find first occurence of "by "

		if (n > -1) {
			name = body.slice(n); // Slice off everything before "by"
			n = nthOccurrence(name, ' ', 3); // Find 3rd space, after the author's name
			name = name.slice(0, n); // Slice off everything after 3rd space
			name = name.slice(3); // Slice off "by "
		}
	}

	// Clean up the name
	name = name.trim();
	[name] = name.split('\n');
	[name] = name.split('|');
	[name] = name.split('--');
	[name] = name.split(' - ');
	[name] = name.split('/');
	[name] = name.split(':');
	name = name.replace(/^(by\s)/i, '');
	name = name.replace(/^(the\s)/i, '');
	name = name.replace(/(www\.)/i, '');
	name = name.replace(/\.com/i, '');
	name = toTitleCase(name);
	name = name.replace(' And ', ' and ');
	name = name.trim();

	const [firstName, lastName] = splitter(name);

	cite.name = name;
	cite.first = firstName;
	cite.last = lastName;
};

const computeDate = () => {
	let date = '';

	const dateTags = [
		'date',
		'Date',
		'created',
		'dat',
		'DC.date',
		'dc.date',
		'DC.date.issued',
		'dc.date.issued',
		'dcterms.created',
		'DCterms.created',
		'dcterms.modified',
		'DCterms.modified',
		'sailthru.date',
	];
	for (const tag of dateTags) {
		const dates = document.getElementsByName(tag);
		if (dates.length > 0) {
			date = dates[0].content;
			break;
		}
	}

	if (!date) {
		rating -= 1;
		const body = document.body.innerText.slice(0, 1500);

		const regexes = [
			/\b\d{1,2}\/\d{1,2}\/(\d{2}|\d{4})\b/, // m/d/yy or mm/dd/yyyy
			/\b(1[0-2]|0?[1-9])-(3[01]|[12][0-9]|0?[1-9])-(?:[0-9]{2})?[0-9]{2}\b/, // m-d-yy or mm-dd-yyyy
			/\b(1[0-2]|0?[1-9])\.(3[01]|[12][0-9]|0?[1-9])\.(?:[0-9]{2})?[0-9]{2}\b/, // m.d.yy or mm.dd.yyyy
			// Full month
			/\b(?:(((Jan(uary)?|Ma(r(ch)?|y)|Jul(y)?|Aug(ust)?|Oct(ober)?|Dec(ember)?)\ 31)|((Jan(uary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sept|Nov|Dec)(ember)?)\ (0?[1-9]|([12]\d)|30))|(Feb(ruary)?\ (0?[1-9]|1\d|2[0-8]|(29(?=,\ ((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))))\,\ ((1[6-9]|[2-9]\d)\d{2}))\b/,
			// Day with st/th/etc
			/\b(?:(((Jan(uary)?|Ma(r(ch)?|y)|Jul(y)?|Aug(ust)?|Oct(ober)?|Dec(ember)?)\ 31)|((Jan(uary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sept|Nov|Dec)(ember)?)\ (0?[1-9]|([12]\d)|30)(st|nd|rd|th))|(Feb(ruary)?\ (0?[1-9]|1\d|2[0-8]|(29(?=,\ ((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))(st|nd|rd|th)))\,\ ((1[6-9]|[2-9]\d)\d{2}))\b/,
			// Month with period
			/\b(?:(((Jan(uary)?|Ma(r(ch)?|y)|Jul(y)?|Aug(ust)?|Oct(ober)?|Dec(ember)?)(.)?\ 31)|((Jan(uary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sept|Nov|Dec)(ember)?)(.)?\ (0?[1-9]|([12]\d)|30))|(Feb(ruary)?(.)?\ (0?[1-9]|1\d|2[0-8]|(29(?=,\ ((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))))\,\ ((1[6-9]|[2-9]\d)\d{2}))\b/,
			// dd MMMM yyyy (parser sometimes mixes up date/month)
			/\b((31(?!\ (Feb(ruary)?|Apr(il)?|June?|(Sep(?=\b|t)t?|Nov)(ember)?)))|((30|29)(?!\ Feb(ruary)?))|(29(?=\ Feb(ruary)?\ (((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))|(0?[1-9])|1\d|2[0-8])\ (Jan(uary)?|Feb(ruary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sep(?=\b|t)t?|Nov|Dec)(ember)?)\ ((1[6-9]|[2-9]\d)\d{2})\b/,
			// MMMM dd, yyyy
			/\b(?:(((Jan(uary)?|Ma(r(ch)?|y)|Jul(y)?|Aug(ust)?|Oct(ober)?|Dec(ember)?)\ 31)|((Jan(uary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sept|Nov|Dec)(ember)?)\ (0?[1-9]|([12]\d)|30))|(Feb(ruary)?\ (0?[1-9]|1\d|2[0-8]|(29(?=,\ ((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))))\,\ ((1[6-9]|[2-9]\d)\d{2}))\b/,
			// Same with caps
			/\b(?:(((JAN(UARY)?|MA(R(CH)?|Y)|JUL(Y)?|AUG(UST)?|OCT(OBER)?|DEC(EMBER)?)\ 31)|((JAN(UARY)?|MA(R(CH)?|Y)|APR(IL)?|JU((LY?)|(NE?))|AUG(UST)?|OCT(OBER)?|(SEPT|NOV|DEC)(EMBER)?)\ (0?[1-9]|([12]\d)|30))|(Feb(ruary)?\ (0?[1-9]|1\d|2[0-8]|(29(?=,\ ((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))))\,\ ((1[6-9]|[2-9]\d)\d{2}))\b/,
			// MMMM dd yyyy
			/\b(?:(((Jan(uary)?|Ma(r(ch)?|y)|Jul(y)?|Aug(ust)?|Oct(ober)?|Dec(ember)?)\ 31)|((Jan(uary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sept|Nov|Dec)(ember)?)\ (0?[1-9]|([12]\d)|30))|(Feb(ruary)?\ (0?[1-9]|1\d|2[0-8]|(29(?=,\ ((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))))\ ((1[6-9]|[2-9]\d)\d{2}))\b/,
			// Same with caps
			/\b(?:(((JAN(UARY)?|MA(R(CH)?|Y)|JUL(Y)?|AUG(UST)?|OCT(OBER)?|DEC(EMBER)?)\ 31)|((JAN(UARY)?|MA(R(CH)?|Y)|APR(IL)?|JU((LY?)|(NE?))|AUG(UST)?|OCT(OBER)?|(SEPT|NOV|DEC)(EMBER)?)\ (0?[1-9]|([12]\d)|30))|(Feb(ruary)?\ (0?[1-9]|1\d|2[0-8]|(29(?=,\ ((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))))\ ((1[6-9]|[2-9]\d)\d{2}))\b/,
			// MMMM. dd, yyyy
			/\b(?:(((Jan(uary)?|Ma(r(ch)?|y)|Jul(y)?|Aug(ust)?|Oct(ober)?|Dec(ember)?)\.\ 31)|((Jan(uary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sept|Nov|Dec)(ember)?)\.\ (0?[1-9]|([12]\d)|30))|(Feb(ruary)?\.\ (0?[1-9]|1\d|2[0-8]|(29(?=,\ ((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))))\ ((1[6-9]|[2-9]\d)\d{2}))\b/,
			// Same with caps
			/\b(?:(((JAN(UARY)?|MA(R(CH)?|Y)|JUL(Y)?|AUG(UST)?|OCT(OBER)?|DEC(EMBER)?)\.\ 31)|((JAN(UARY)?|MA(R(CH)?|Y)|APR(IL)?|JU((LY?)|(NE?))|AUG(UST)?|OCT(OBER)?|(SEPT|NOV|DEC)(EMBER)?)\.\ (0?[1-9]|([12]\d)|30))|(Feb(ruary)?\.\ (0?[1-9]|1\d|2[0-8]|(29(?=,\ ((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))))\ ((1[6-9]|[2-9]\d)\d{2}))\b/,
			// MMMM. dd, yyyy
			/\b(?:(((Jan(uary)?|Ma(r(ch)?|y)|Jul(y)?|Aug(ust)?|Oct(ober)?|Dec(ember)?)\.\ 31)|((Jan(uary)?|Ma(r(ch)?|y)|Apr(il)?|Ju((ly?)|(ne?))|Aug(ust)?|Oct(ober)?|(Sept|Nov|Dec)(ember)?)\.\ (0?[1-9]|([12]\d)|30))|(Feb(ruary)?\.\ (0?[1-9]|1\d|2[0-8]|(29(?=,\ ((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))))\,\ ((1[6-9]|[2-9]\d)\d{2}))\b/,
			// Same with caps
			/\b(?:(((JAN(UARY)?|MA(R(CH)?|Y)|JUL(Y)?|AUG(UST)?|OCT(OBER)?|DEC(EMBER)?)\.\ 31)|((JAN(UARY)?|MA(R(CH)?|Y)|APR(IL)?|JU((LY?)|(NE?))|AUG(UST)?|OCT(OBER)?|(SEPT|NOV|DEC)(EMBER)?)\.\ (0?[1-9]|([12]\d)|30))|(Feb(ruary)?\.\ (0?[1-9]|1\d|2[0-8]|(29(?=,\ ((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))))))\,\ ((1[6-9]|[2-9]\d)\d{2}))\b/,
		];

		for (const regex of regexes) {
			const match = body.match(regex);
			if (match && match[0]) {
				[date] = match;
				break;
			}
		}
	}

	// If we couldn't find a date, reduce rating substantially
	if (!date) {
		rating -= 2;
	}

	// Remove timestamp from date
	if (
		date &&
		date.length > 10 &&
		date.indexOf(' ') === -1 &&
		date.indexOf('T') === 10
	) {
		date = date.slice(0, 10);
	}

	cite.date = date.trim();

	// Parse individual date parts
	const timestamp = Date.parse(date);
	if (!Number.isNaN(timestamp)) {
		const d = new Date(timestamp);
		cite.year = d.getFullYear().toString();
		cite.shortYear = cite.year.slice(-2);
		cite.month = (d.getMonth() + 1).toString(); // getMonth returns 0-11
		cite.day = d.getDate().toString();
	}
};

const computeTitle = () => {
	let title = '';

	// Try most common title tags
	const titleTags = ['og:title', 'DC.title', 'headline'];
	for (const tag of titleTags) {
		const titles = document.getElementsByName(tag);
		if (titles.length > 0) {
			title = titles[0].content;
			break;
		}
	}

	// Try title meta tag
	if (!title) {
		const meta = document.getElementsByTagName('meta');
		for (let i = 0; i < meta.length; i++) {
			if (meta[i].getAttribute('property') === 'og:title') {
				title = meta[i].content;
			}
		}
	}

	// Worst case, use HTML title
	if (!title) {
		title = document.title;
	}

	// Clean up title
	[title] = title.split('|');
	[title] = title.split('--');
	[title] = title.split(' - ');

	cite.title = title.trim();
};

const computePublication = () => {
	let publication = '';

	// Try most common publication tags
	const pubTags = ['og:site_name', 'cre'];
	for (const tag of pubTags) {
		const pubs = document.getElementsByName(tag);
		if (pubs.length > 0) {
			publication = pubs[0].content;
			break;
		}
	}

	// Try publication meta tag
	if (!publication) {
		const meta = document.getElementsByTagName('meta');
		for (let i = 0; i < meta.length; i++) {
			if (meta[i].getAttribute('property') === 'og:site_name') {
				publication = meta[i].content;
			}
		}
	}

	if (!publication) {
		rating -= 1;
	}

	// Clean up publication
	publication = publication.replace(/^(the )/i, '');
	publication = publication.replace(/(www\.)/i, '');
	publication = publication.replace(/\.com/i, '');

	cite.publication = publication.trim();

	// Use publication as fallback for name
	if (!cite.name) {
		cite.name = publication.trim();
	}
};

const computeCite = () => {
	rating = 8;
	computeName();
	computeDate();
	computeTitle();
	computePublication();

	// Ensure some sane defaults
	if (!cite.name) cite.name = 'No Author';
	if (!cite.month) cite.month = 'xx';
	if (!cite.day) cite.day = 'xx';
	if (!cite.year) cite.year = 'xxxx';
	if (!cite.shortYear) cite.shortYear = 'xx';
	if (!cite.publication) cite.publication = 'No Publication';
};

const init = async () => {
	const settings = await browser.storage.sync.get(null);
	if (settings.enabled) {
		if (settings.debugMode) {
			log(`[Cite Creator] Enabled! Settings: ${JSON.stringify(settings)}`);
		}
		computeCite();
		displayCite();
		configureHotkeys();
	} else if (settings.debugMode) {
		removeCite();
		log('[Cite Creator] Disabled, doing nothing.');
	}
};

init();

// Auto-reload cite box on settings changes
browser.storage.sync.onChanged.addListener(() => {
	init();
});
