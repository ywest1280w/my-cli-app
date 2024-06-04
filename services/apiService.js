import fetch from 'node-fetch';
import { parseXML } from './xmlService.js';

async function fetchData(url, options) {
	const response = await fetch(url, options);
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	const contentType = response.headers.get('content-type');
	if (contentType && contentType.includes('application/json')) {
		return response.json();
	} else {
		return response.text();
	}
}

export async function callApiAndProcessData(postUrl, headers, body, formatGMTDate) {
	try {
		const now = new Date();
		const oneHourAgo = new Date(now);
		oneHourAgo.setHours(oneHourAgo.getHours() - 1);

		let from = formatGMTDate(oneHourAgo);
		let to = formatGMTDate(now);

		const updatedBody = {
			...body,
			mplSelections: body.mplSelections.map(selection => ({
				...selection,
				from: from,
				to: to
			}))
		};

		const options = {
			method: 'POST',
			headers,
			body: JSON.stringify(updatedBody)
		};
		const xmlData = await fetchData(postUrl, options);
		console.log(xmlData);
		await parseXML(xmlData);
	} catch (error) {
		console.error('Error: ', error);
	}
}
