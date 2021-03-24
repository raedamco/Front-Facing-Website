$(document).ready(() => {
	$(".rot13").each((index, elem) => {
		$(elem).text($(elem).text().replace(/[a-z]/gi, (char) => {
			return String.fromCharCode((char<="Z"?90:122)>=(c=char.charCodeAt(0)+13)?c:c-26);
		}));
	});
	$(".rot5").each((index, elem) => {
		$(elem).text($(elem).text().replace(/[0-9]/g, (char) => {
			return String.fromCharCode(57>=(c=char.charCodeAt(0)+5)?c:c-10);
		}));
	});
});