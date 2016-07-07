/// <reference path="../../typings/chrome/chrome.d.ts"/>
document.addEventListener("mousedown", function (event) {
	//right click
	console.log(event);
	var t: any= event.target;
	chrome.runtime.sendMessage({
		from: 'content',
		subject: 'showPageAction',
		info: {target: t.id, class:t.class}
	});
}, true);

/*chrome.runtime.onMessage.addListener(function (msg, sender, response) {
	if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
		// Collect the necessary data 
		// (For your specific requirements `document.querySelectorAll(...)`
		//  should be equivalent to jquery's `$(...)`)
		var domInfo = {
			total: document.querySelectorAll('*').length,
			inputs: document.querySelectorAll('input').length,
			buttons: document.querySelectorAll('button').length
		};
		// Directly respond to the sender (popup), 
		// through the specified callback */
		/*response(domInfo);
	}
});*/