//index.js
const readline = require('readline').promises;

async function main() {
	let usrId = "";
	let usrPwd = "";

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	try {
		usrId = await rl.question('Enter ID :');
		usrPwd = await rl.question('Enter Password :');
	} finally {
		rl.close();
	}

	console.log(`Your Id is :${usrId}`);
	console.log(`Your Password is :${usrPwd}`);

	// API 호출 부분
	try {
		const response = await fetch ('https://cncity-is-dev.integrationsuite.cfapps.ap12.hana.ondemand.com/api/v2/MessageProcessingLogs/$count',{
			headers: {
				'Authorization': 'Basic eXNjaG9pQGl1bmlyLmNvLmtyOlI1dTFpNGU4dDVkQA=='
			}
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		
		const contentType = response.headers.get('content-type');
		let data;
		if(contentType && contentType.includes('application/json')){
			data = await response.json();
		}
		else{
			data = await response.text();
		}
		console.log('API Response:', data);
	} catch (error) {
		console.error('Error calling API:', error);
	}
}
main().catch(console.error);