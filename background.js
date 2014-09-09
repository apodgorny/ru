var URL_GOOGLE      = 'https://www.google.com/webhp?sourceid=chrome-instant&rlz=1C1SNNT_enUS599US599&ion=1&espv=2&ie=UTF-8#q=';
var bInlineTranslit = false;

function navigate(url) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.update(tabs[0].id, {url: url});
	});
}

function copyToClipboard(s, sMimeType) {
	sMimeType = sMimeType || 'text/plain';
	document.oncopy = function(oEvent) {
		oEvent.clipboardData.setData(sMimeType, s);
		oEvent.preventDefault();
	};
	document.execCommand('Copy', false, null);
}

function toggleInlineTranslit() {
	var sIconPath = bInlineTranslit
		? 'icon19_off.png'
		: 'icon19.png';
		
	console.log(sIconPath);
	chrome.browserAction.setIcon({
		path: sIconPath
	});
	
	bInlineTranslit = !bInlineTranslit;
	
	chrome.tabs.query({active: true, currentWindow: true}, function(aTabs){
		chrome.tabs.sendMessage(
			aTabs[0].id,
			{name: 'TOGGLE_INLINE_TRANSLIT', value: bInlineTranslit},
			function(oResponse) {}
		);
	});
}

chrome.omnibox.onInputChanged.addListener(function(sText, fSuggest) {
	var sTranslated        = translate(sText);
	var sDefaultSuggestion = 'Search: ';
	
	if (sTranslated.length > 0) {
		sDefaultSuggestion = 'Search: "' + sTranslated + '"'
	}
	chrome.omnibox.setDefaultSuggestion({
		description: sDefaultSuggestion
	});
	fSuggest([
		{content: 'ru:copy:' + sTranslated, description: 'Copy to clipboard: "' + sTranslated + '"'}
	]);
});
  
chrome.omnibox.onInputEntered.addListener(function(sText) {
	if (sText.indexOf('ru:copy:') == 0) {
		copyToClipboard(sText.substr(8));
		alert('"' + sText.substr(8) + '" was copied to clipboard')
	} else {
		navigate(URL_GOOGLE + translate(sText));
	}
});

chrome.extension.onMessage.addListener(
	function(oEvent, oSender, fSendResponse) {
		switch (oEvent.name) {
			case 'DEBUG':
				console.log('DEBUG:', oEvent.message);
				break;
			case 'TOGGLE_INLINE_TRANSLIT':
				toggleInlineTranslit(oEvent, oSender);
				break;
			default:
				console.log(oEvent.name);
				break;
		}
		fSendResponse({});
	}
);

















