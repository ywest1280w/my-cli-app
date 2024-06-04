import { getSessionInfo, displaySessionInfo } from './helpers/sessionHelper.js';
import { callApiAndProcessData } from './services/apiService.js';
import { formatGMTDate } from './helpers/dateHelper.js';

async function main() {
	const sessionInfo = await getSessionInfo();
	displaySessionInfo(sessionInfo);

	const headers = {
		'Content-Type': 'application/json',
		'Host': 'cncity-is-dev.integrationsuite.cfapps.ap12.hana.ondemand.com',
		'Cookie': `__VCAP_ID__=${sessionInfo.VCAP_ID}; JSESSIONID=${sessionInfo.JSESSIONID}`,
		'X-CSRF-Token': `${sessionInfo.xCsrfToken}`
	};

	const body = {
		mplSelections: [
			{},
			{ status: 'FAILED' },
			{ status: 'RETRY' },
			{ status: 'COMPLETED' },
			{ status: 'PROCESSING' }
		],
		artifactSelections: [
			{ type: 'ALL', status: 'ALL' },
			{ type: 'ALL', status: 'STARTED' },
			{ type: 'ALL', status: 'ERROR' }
		],
		securityMaterialsSelections: [
			{ type: 'ALL' }
		],
		dataStoreSelections: [
			{ status: 'ALL' }
		],
		includeNumberRangeObjectCount: true,
		includeMessageQueueCount: true,
		includeMessageUsageCount: true
	};

	const postUrl = 'https://cncity-is-dev.integrationsuite.cfapps.ap12.hana.ondemand.com/Operations/com.sap.it.op.tmn.commands.dashboard.webui.StatisticOverviewCommand';

	// 5초 간격으로 API 호출
	setInterval(() => {
		callApiAndProcessData(postUrl, headers, body, formatGMTDate);
	}, 5000);
}

main().catch(console.error);
