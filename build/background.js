var contextMenuCreated = false;
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
chrome.runtime.onMessage.addListener(function (request, sender){
    if (request.from === 'content' && request.subject === 'contextmenu')
    {
        var selector = request.info.id ? request.info.id : request.info.path;

        if (contextMenuCreated)
        {
            chrome.contextMenus.update("ensureContext",
                {
                    title: "Ensure existence of element with selector: '" + selector + "'",
                    onclick: function(){
                        chrome.runtime.sendMessage({
                            from: 'background',
                            subject: 'ensure',
                            info: request.info
                        })}
                });
        }
        else
        {
            chrome.contextMenus.create({
                id: "ensureContext",
                title: "Ensure existence of element with selector: '" + selector + "'", 
                contexts:["all"], 
                onclick: function(){
                    chrome.runtime.sendMessage({
                        from: 'background',
                        subject: 'ensure',
                        info: request.info
                    });
                },
            });
            contextMenuCreated = true;
        }
    }
});
/*
chrome.webRequest.onErrorOccurred.addListener(function(details){
    console.log(details);
}, {urls: [ "<all_urls>" ]});

/* make sure we're sending a message to chrome service via messaging api. 
chrome.webRequest.onBeforeRequest.addListener(function(details){
    console.log(details);
    if (isExternalEvent(details.url))
    {
        console.log(details.url);
        chrome.runtime.sendMessage({
                from: 'background',
                subject: 'UrlChange',
                info: {'noinfo': 'noinfo'}
            });
    }
}, {urls: [ "<all_urls>" ], types: ['script']});


function isExternalEvent(url)
{
	return url.indexOf('chrome-extension') < 0;
}*/