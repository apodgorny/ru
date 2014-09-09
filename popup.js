function debug(s) {
	chrome.extension.sendMessage({directive: 'DEBUG', message: s}, function() {});
}

document.addEventListener('DOMContentLoaded', function () {
	chrome.extension.sendMessage({name: 'TOGGLE_INLINE_TRANSLIT'}, function() {
		this.close();
	});
});