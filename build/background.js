chrome.browserAction.onClicked.addListener(function () {
    chrome.windows.create({
        url: 'extension.html',
        type: 'popup',
        left: 0,
        top: 0,
        width: 300,
        focused: true
    });
});

/** make sure we're sending a message to chrome service via messaging api. */
chrome.webRequest.onBeforeRequest.addListener(function(details){
    console.log(details);
    chrome.runtime.sendMessage({
			from: 'background',
			subject: 'UrlChange',
			info: {'noinfo': 'noinfo'}
		})
}, {urls: [ "<all_urls>" ]});



/*
chrome.runtime.onMessage.addListener((msg, sender) => {
    if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {
        // Enable the page-action for the requesting tab
        chrome.pageAction.show(sender.tab.id);
    }
});*/ 
