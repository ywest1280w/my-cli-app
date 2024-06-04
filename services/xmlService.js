import { DOMParser } from 'xmldom';
import xpath from 'xpath';

export async function parseXML(xml) {
	try {
		const doc = new DOMParser().parseFromString(xml);
		const expAllCount = '/com.sap.it.op.tmn.commands.dashboard.webui.StatisticOverviewResponse/mplNumbers[not(criteria/status)]/count';
		const expRetryCount = '/com.sap.it.op.tmn.commands.dashboard.webui.StatisticOverviewResponse/mplNumbers[criteria/status="RETRY"]/count';
		const expFailedCount = '/com.sap.it.op.tmn.commands.dashboard.webui.StatisticOverviewResponse/mplNumbers[criteria/status="FAILED"]/count';
		const expProcessingCount = '/com.sap.it.op.tmn.commands.dashboard.webui.StatisticOverviewResponse/mplNumbers[criteria/status="PROCESSING"]/count';
		const expCompletedCount = '/com.sap.it.op.tmn.commands.dashboard.webui.StatisticOverviewResponse/mplNumbers[criteria/status="COMPLETED"]/count';

		const allNodes = xpath.select(expAllCount, doc);
		const retryNodes = xpath.select(expRetryCount, doc);
		const failedNodes = xpath.select(expFailedCount, doc);
		const processingNodes = xpath.select(expProcessingCount, doc);
		const completedNodes = xpath.select(expCompletedCount, doc);

		console.log("");
		if (allNodes.length > 0) {
			const countValue = allNodes[0].firstChild.data;
			console.log('All Messages Counts: ', countValue);
		} else {
			console.log('No nodes found.');
		}
		if (retryNodes.length > 0) {
			const countValue = retryNodes[0].firstChild.data;
			console.log('Retry Messages Counts: ', countValue);
		} else {
			console.log('No Retry nodes found.');
		}
		if (failedNodes.length > 0) {
			const countValue = failedNodes[0].firstChild.data;
			console.log('Failed Messages Counts: ', countValue);
		} else {
			console.log('No Failed nodes found.');
		}
		if (processingNodes.length > 0) {
			const countValue = processingNodes[0].firstChild.data;
			console.log('Processing Messages Counts: ', countValue);
		} else {
			console.log('No Processing nodes found.');
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
