document.addEventListener("mousedown", function (event) {
	if (isExternalEvent(event) && event.button === 2)
	{
		chrome.runtime.sendMessage({
			from: 'content',
			subject: 'contextmenu',
			info: {id: event.target.id, name: event.target.name, className: event.target.className}
		});
	}
	else if (isExternalEvent(event) && event.button == 0)
	{
		chrome.runtime.sendMessage({
			from: 'content',
			subject: 'click',
			info: {id: event.target.id, className:event.target.className}
		});
	}
}, true);
var previousElement;
document.addEventListener('DOMSubtreeModified', function(event) {
	if (document.getElementsByTagName('iframe').length !== 0)
	{
		var monitor = setInterval(function(){
			var elem = document.activeElement;
			if(elem && elem.tagName == 'IFRAME')
			{
				// Context is changed.
				if (!previousElement || previousElement != elem.id)
				{
					previousElement = elem.id;
					chrome.runtime.sendMessage({
						from: 'content',
						subject: 'iframesubload',
						info: {type: 'iframesubload', url: event.target.URL, id: elem.id}
					});
				}
			}
		}, 100);
	}
});

document.addEventListener('DOMContentLoaded', function (event) {
	if (isExternalEvent(event))
	{
		chrome.runtime.sendMessage({
			from: 'content',
			subject: 'load',
			info: {type: 'load', url: event.target.URL}
		});
	}
}, true);
document.addEventListener('focus', function (event) {
	if (isExternalEvent(event))
	{
		chrome.runtime.sendMessage({
			from: 'content',
			subject: 'focus',
			info: {id: event.target.id, className:event.target.className}
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
				info: {id: event.target.id, name: event.target.name, className: event.target.className}
			});
		}
		else if (event.target.value)
		{
			chrome.runtime.sendMessage({
				from: 'content',
				subject: 'text',
				info: {id: event.target.id, text: event.target.value, name: event.target.name, className: event.target.className}
			});
		}
	}
}, true);

function isExternalEvent(event)
{
	return event.target.baseURI.indexOf('chrome-extension') < 0;
}
