module ExtensionApp.Controllers
{
	/**
	 * Events controller class.
	 */
	export class EventsController
	{
		/**
		 * Events array
		 */
		events: Array<any>;

		/**
		 * Menu options
		 */
		menuOptions: Array<any> = 
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

		/**
		 * Dependency injection.
		 */
		static $inject = ['ChromeService'];

		/**
		 * Constructor for events controller.
		 * @param ChromeService chrome service
		 */
		constructor(private ChromeService: Services.ChromeService)
		{
			this.events = this.ChromeService.events;
		}

		/**
		 * Remove event from the chrome service.
		 * @param index Index to remove.
		 */
		RemoveEvent(index: number)
		{
			this.ChromeService.RemoveEvent(index);
		}
	}
}