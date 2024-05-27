//index.js
import { parseStringPromise } from 'xml2js';
import xpath from 'xpath';
import { DOMParser } from 'xmldom';
import fetch from 'node-fetch';
import readline from 'readline/promises';

function formatGMTDate(dateObj) {

	// UTC 기준으로 각 구성 요소를 가져오기
	const year = dateObj.getUTCFullYear();
	const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더합니다.
	const date = String(dateObj.getUTCDate()).padStart(2, '0');
	const hours = String(dateObj.getUTCHours()).padStart(2, '0');
	const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
	const seconds = String(dateObj.getUTCSeconds()).padStart(2, '0');

	// 원하는 형식으로 문자열을 조합
	return `${year}-${month}-${date}T${hours}:${minutes}:${seconds}Z`;
}

async function getSessionInput() {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	try {
		const VCAP_ID = await rl.question('Enter __VCAP_ID__: ');
		const JSESSIONID = await rl.question('Enter JSESSIONID: ');
		const xCsrfToken = await rl.question('Enter X-CSRF-Token: ')
		return { VCAP_ID, JSESSIONID, xCsrfToken };
	} finally {
		rl.close();
	}
}

function displaySessionInfo({ VCAP_ID, JSESSIONID, xCsrfToken }) {
	const lineChar = '='.repeat(125);
	console.log(lineChar);
	console.log(`VCAP_ID is: ${VCAP_ID}`);
	console.log(`JSESSIONID is: ${JSESSIONID}`);
	console.log(`X-CSRF-Token: ${xCsrfToken}`);
	console.log(lineChar);
}

async function fetchData(url, options) {
	const response = await fetch(url, options);
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	const contentType = response.headers.get('contetn-type');
	if (contentType && contentType.includes('application/json')) {
		return response.json();
	} else {
		return response.text();
	}
}

async function parseXML(xml) {
	try {
		const doc = new DOMParser().parseFromString(xml);
		const expFailedCount = '/com.sap.it.op.tmn.commands.dashboard.webui.StatisticOverviewResponse/mplNumbers[criteria/status="FAILED"]/count';
		const expCompoletedCount = `/com.sap.it.op.tmn.commands.dashboard.webui.StatisticOverviewResponse/mplNumbers[criteria/status="COMPLETED"]/count`

		const failedNodes = xpath.select(expFailedCount, doc);
		const completedNodes = xpath.select(expCompoletedCount, doc);

		console.log("");
		if (failedNodes.length > 0) {
			const countValue = failedNodes[0].firstChild.data;
			console.log('Failed Messages Counts: ', countValue);
		} else {
			console.log('No Failed nodes found.');
		}
		if (completedNodes.length > 0) {
			const countValue = completedNodes[0].firstChild.data;
			console.log('Completed Messages Counts: ', countValue);
		} else {
			console.log('No Completed nodes found.');
		}
		console.log("");

	} catch (error) {
		console.error('Error Parsing XML: ', error);
	}
}

async function fetchAndProcessData(postUrl, headers, body) {
	try {
		const options = {
			method: 'POST',
			headers,
			body: JSON.stringify(body)
		};
		const xmlData = await fetchData(postUrl, options);
		// console.log('API Response: ',xmlData);
		await parseXML(xmlData);
	} catch (error) {
		console.error('Error: ', error);
	}
}


async function main() {
	const now = new Date();
	// console.log(formatGMTDate(now));

	const oneHourAgo = new Date(now);
	oneHourAgo.setHours(oneHourAgo.getHours() - 1);
	// console.log(formatGMTDate(oneHourAgo));

	const sessionInfo = await getSessionInput();
	displaySessionInfo(sessionInfo);
	let from = formatGMTDate(oneHourAgo);
	let to = formatGMTDate(now);
	const postUrl = 'https://cncity-is-dev.integrationsuite.cfapps.ap12.hana.ondemand.com/Operations/com.sap.it.op.tmn.commands.dashboard.webui.StatisticOverviewCommand';
	const headers = {
		'Content-Type': 'application/json',
		'Host': 'cncity-is-dev.integrationsuite.cfapps.ap12.hana.ondemand.com',
		'Cookie': `__VCAP_ID__=${sessionInfo.VCAP_ID}; JSESSIONID=${sessionInfo.JSESSIONID}`,
		'X-CSRF-Token': `${sessionInfo.xCsrfToken}`
	};
	const body =
	{
		mplSelections: [
			{
				from: `${from}`,
				to: `${to}`
			},
			{
				from: `${from}`,
				to: `${to}`,
				status: 'FAILED'
			},
			{
				from: `${from}`,
				to: `${to}`,
				status: 'RETRY'
			},
			{
				from: `${from}`,
				to: `${to}`,
				status: 'COMPLETED'
			}
		],
		artifactSelections: [
			{
				type: 'ALL',
				status: 'ALL'
			},
			{
				type: 'ALL',
				status: 'STARTED'
			},
			{
				type: 'ALL',
				status: 'ERROR'
			}
		],
		securityMaterialsSelections: [
			{
				type: 'ALL'
			}
		],
		dataStoreSelections: [
			{
				'status': 'ALL'
			}
		],
		includeNumberRangeObjectCount: true,
		includeMessageQueueCount: true,
		includeMessageUsageCount: true
	};

	// 10초 간격
	setInterval(() => {
		fetchAndProcessData(postUrl, headers, body);


	}, 10000);
}
main().catch(console.error);