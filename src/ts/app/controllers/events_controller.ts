/// <reference path="../../../../typings/chrome/chrome.d.ts"/>
module ExtensionApp.Controllers
{
	/**
	 * Events Scope
	 */
	interface EventsScope extends ng.IScope
	{
		events: any;
		navigation: string;
		selection: string;
		menuOptions: any;
	}

	/**
	 * Events controller class.
	 */
	export class EventsController
	{
		/**
		 * Dependency injection.
		 */
		static $inject = ['$scope', 'ChromeService', 'chrome'];

		/**
		 * Constructor for events controller.
		 * @param $scope the scope
		 * @param ChromeService chrome service
		 */
		constructor(private $scope: EventsScope, private ChromeService: Services.ChromeService, private chrome: any)
		{
			if (!ChromeService.isInitialized)
			{
				this.InitializeEventHandlers();
				ChromeService.isInitialized = true;
			}
			$scope.events = ChromeService.events;
			$scope.menuOptions =
				[
					['Mark as Setup', function ($itemScope) {
						$itemScope.event.testtype = 'setup';
					}],null,
					['Mark as Test', function ($itemScope) {
						$itemScope.event.testtype = 'test';
					}],null,
					['Mark as Result', function($itemScope) {
						$itemScope.event.testtype = 'result';
					}]
				];
		}

		/**
		 * Initialize event handlers
		 */
		InitializeEventHandlers()
		{
			var _ChromeService = this.ChromeService;
			var scope = this.$scope;
			this.chrome.runtime.onMessage.addListener(function (msg, sender, response) {
				
				/** If the sender is content script */
				if (msg.from === 'content')
				{
					if (msg.subject)
					{
						/** Page load */
						if (msg.subject === 'load')
						{
							_ChromeService.AddLoadEvent({url: msg.info.url});
						}
						/** Click event */
						else if (msg.subject === 'click')
						{
							_ChromeService.AddClickEvent({id: msg.info.id});
						}
						/** Focus event */
						else if (msg.subject === 'focus')
						{
						}
						/** Key up event */
						else if (msg.subject === 'keyup')
						{
							_ChromeService.AddKeyEvent({id: msg.info.id, text: msg.info.text});
						}
					}
				}
				else if (msg.from === 'background')
				{
					/**  */
					if (msg.subject)
					{
						if (msg.subject === 'UrlChange')
						{
							//_ChromeService.AddEvent()
						}
					}
				}
				//_ChromeService.AddEvent({class: msg.info.class, id: msg.info.id, type: msg.subject});
				scope.events = _ChromeService.events;
				scope.$apply();
			});
		}
	}
}