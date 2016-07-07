document.addEventListener("mousedown", function (event) {
	//right click
	console.log(event);
	console.log(event.target);
	if (isExternalEvent(event))
	{
		chrome.runtime.sendMessage({
			from: 'content',
			subject: 'click',
			info: {id: event.target.id, class:event.target.className}
		});
	}
}, true);
document.addEventListener('DOMContentLoaded', function (event) {
	console.log('page is ready');
	console.log(event);
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
	console.log('focused to: ' + event.target);
	console.log(event);
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
	console.log(event.key);
	if (isExternalEvent(event))
	{
		chrome.runtime.sendMessage({
			from: 'content',
			subject: 'keyup',
			info: {id: event.target.id, text: event.target.value}
		});
	}
}, true);

function isExternalEvent(event)
{
	return event.target.baseURI.indexOf('chrome-extension') < 0;
}
