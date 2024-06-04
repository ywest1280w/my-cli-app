export function formatGMTDate(dateObj) {
	const year = dateObj.getUTCFullYear();
	const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
	const date = String(dateObj.getUTCDate()).padStart(2, '0');
	const hours = String(dateObj.getUTCHours()).padStart(2, '0');
	const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
	const seconds = String(dateObj.getUTCSeconds()).padStart(2, '0');

	return `${year}-${month}-${date}T${hours}:${minutes}:${seconds}Z`;
}
