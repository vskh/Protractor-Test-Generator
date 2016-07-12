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
/** Context menu listening.. */
/** This creates more than one menu item. Need to fix this. */
chrome.runtime.onMessage.addListener(function (request, sender){
    if (request.from === 'content' && request.subject === 'contextmenu')
    {
        chrome.contextMenus.create({
            title: "Ensure existence of element with id: '" + request.info.id + "'", 
            contexts:["all"], 
            onclick: function(){
                console.log('onclick');
            },
        });
    }
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