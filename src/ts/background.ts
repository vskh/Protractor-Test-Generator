/// <reference path="../../typings/chrome/chrome.d.ts"/>
chrome.browserAction.onClicked.addListener(() => {
	chrome.windows.create(
	{
		url: 'extension.html',
		type: 'popup',
		left: 0,
		top: 0,
		width: 300,
		focused: true
	});
});
/*
chrome.runtime.onMessage.addListener((msg, sender) => {
	if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {
		// Enable the page-action for the requesting tab
		chrome.pageAction.show(sender.tab.id);
	}
});*/