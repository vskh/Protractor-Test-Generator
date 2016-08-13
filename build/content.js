jQuery.fn.extend({
	getPath: function () {
		var path, node = this;
		while (node.length) {
			var realNode = node[0], name = realNode.localName;
			if (!name) break;
			name = name.toLowerCase();

			var parent = node.parent();

			var sameTagSiblings = parent.children(name);
			if (sameTagSiblings.length > 1) { 
				allSiblings = parent.children();
				var index = allSiblings.index(realNode) + 1;
				if (index > 1) {
					name += ':nth-child(' + index + ')';
				}
			}

			path = name + (path ? '>' + path : '');
			node = parent;
		}

		return path;
	}
});

document.addEventListener("mousedown", function (event) {
	if (isExternalEvent(event))
	{
		let messageInfo = craftMessageInfo(event);
		if (event.button === 2)
		{
			chrome.runtime.sendMessage({
				from: 'content',
				subject: 'contextmenu',
				info: messageInfo
			});
		}
		else if (event.button === 0)
		{
			chrome.runtime.sendMessage({
				from: 'content',
				subject: 'click',
				info: messageInfo
			});
		}
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
				/*chrome.storage.local.get('frame', function(result)
				{
					if (!result.frame || result.frame != elem.id)
					{
						chrome.storage.local.set({'frame': elem.id}, function(){
							chrome.runtime.sendMessage({
								from: 'content',
								subject: 'iframesubload',
								info: {type: 'iframesubload', url: event.target.URL, id: elem.id}
							});
						});
					}
				});*/
				/*chrome.storage.local.set({'frame': previousElement}, function() {
					// Notify that we saved.
					message('Settings saved');
				});*/
				if (!previousElement || previousElement != elem.id)
				{
					previousElement = elem.id;
					chrome.runtime.sendMessage({
						from: 'content',
						subject: 'iframesubload',
						info: {type: 'iframesubload', url: event.target.baseURI, id: elem.id}
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
		let messageInfo = craftMessageInfo(event);
		if (event.key === 'Enter')
		{
			chrome.runtime.sendMessage({
				from: 'content',
				subject: 'enter',
				info: messageInfo
			});
		}
		else if (event.target.value)
		{
			messageInfo.text = event.target.value;
			chrome.runtime.sendMessage({
				from: 'content',
				subject: 'text',
				info: messageInfo
			});
		}
	}
}, true);

function isExternalEvent(event)
{
	return event.target.baseURI.indexOf('chrome-extension') < 0;
}

function craftMessageInfo(event)
{
	let messageInfo = {url: event.target.baseURI};
	if (!event.target.id || event.target.id.length === 0)
	{
		messageInfo.path = $(event.target).getPath();
	}
	else
	{
		messageInfo.id = event.target.id;
	}
	return messageInfo;
}
