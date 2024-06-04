import readline from 'readline/promises';

export async function getSessionInfo() {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	try {
		const VCAP_ID = await rl.question('Enter __VCAP_ID__: ');
		const JSESSIONID = await rl.question('Enter JSESSIONID: ');
		const xCsrfToken = await rl.question('Enter X-CSRF-Token: ');
		return { VCAP_ID, JSESSIONID, xCsrfToken };
	} finally {
		rl.close();
	}
}

export function displaySessionInfo({ VCAP_ID, JSESSIONID, xCsrfToken }) {
	const lineChar = '='.repeat(125);
	console.log(lineChar);
	console.log(`VCAP_ID is: ${VCAP_ID}`);
	console.log(`JSESSIONID is: ${JSESSIONID}`);
	console.log(`X-CSRF-Token: ${xCsrfToken}`);
	console.log(lineChar);
}
