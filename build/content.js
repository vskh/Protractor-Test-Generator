document.addEventListener("mousedown", function (event) {
	if (isExternalEvent(event) && event.button === 2)
	{
		chrome.runtime.sendMessage({
			from: 'content',
			subject: 'contextmenu',
			info: {id: event.target.id}
		});
	}
	else if (isExternalEvent(event) && event.button == 0)
	{
		chrome.runtime.sendMessage({
			from: 'content',
			subject: 'click',
			info: {id: event.target.id, class:event.target.className}
		});
	}
}, true);
document.addEventListener('DOMContentLoaded', function (event) {
	if (isExternalEvent(event))
	{
		let iframes = document.getElementsByTagName('iframe');
		// IFrames
		if (iframes && iframes.length > 0)
		{
			var arr = [];
			let iframeDetails = [];
			for(var i = iframes.length; i--; iframeDetails.unshift(iframes[i]));

			chrome.runtime.sendMessage({
				from: 'content',
				subject: 'loadwithiframe',
				info: {
					type: 'loadwithiframe',
					url: event.target.URL,
					iframes: iframeDetails
				}
			});
		}
		// No Iframes
		else
		{
			chrome.runtime.sendMessage({
				from: 'content',
				subject: 'load',
				info: {type: 'load', url: event.target.URL}
			});
		}
	}
}, true);
document.addEventListener('focus', function (event) {
	if (isExternalEvent(event))
	{
		chrome.runtime.sendMessage({
			from: 'content',
			subject: 'focus',
			info: {id: event.target.id, class:event.target.className}
		})
	}
}, true);
document.addEventListener('keyup', function(event) {
	if (isExternalEvent(event))
	{
		if (event.key === 'Enter')
		{
			chrome.runtime.sendMessage({
				from: 'content',
				subject: 'enter',
				info: {id: event.target.id}
			});
		}
		else if (event.target.value)
		{
			chrome.runtime.sendMessage({
				from: 'content',
				subject: 'text',
				info: {id: event.target.id, text: event.target.value}
			});
		}
	}
}, true);

function isExternalEvent(event)
{
	return event.target.baseURI.indexOf('chrome-extension') < 0;
}
