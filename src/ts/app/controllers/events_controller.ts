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
			$scope.events = ChromeService.events;
			$scope.menuOptions =
				[
					['Mark as Setup', function ($itemScope) {
						$itemScope.event.testtype = 'setup';
					}],null,
					['Mark as Step', function($itemScope) {
						$itemScope.event.testtype = 'step';
					}], null,
					['Mark as Test', function ($itemScope) {
						$itemScope.event.testtype = 'test';
					}],null,
					['Mark as Result', function($itemScope) {
						$itemScope.event.testtype = 'result';
					}]
				];
		}

		/**
		 * Remove event from the chrome service.
		 * @param index Index to remove.
		 */
		RemoveEvent(index: number)
		{
			this.ChromeService.events = this.ChromeService.events.splice(index, 1);
		}
	}
}