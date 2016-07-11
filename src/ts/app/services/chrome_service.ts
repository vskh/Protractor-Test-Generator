module ExtensionApp.Services
{
	/**
	 * Chrome service class.
	 */
	export class ChromeService
	{
		/** Events array */
		public events = [];

		/** Navigation? */
		public navigation: string = '';

		/** Selection */
		public selection: string;

		/** If the service is initialized */
		public isInitialized: boolean;

		/** Key queue */
		public keyQueue: {id: string, text: string}[] = [];

		/** Chrome tab id */
		public testingTabId: any;

		/** Dependency injection. */
		static $inject = ['$timeout', 'chrome'];

		/**
		 * Constructor for the chrome service.
		 * @param $scope Scope
		 * @param chrome Chrome runtime
		 */
		constructor(private timeout: ng.ITimeoutService, private chrome: any)
		{
			this.isInitialized = false;
		}

		/**
		 * Ensure that we're only looking to the same tab
		 * and registering events from that tab
		 */
		public Initialize(tabId: number)
		{
			this.testingTabId = tabId;
			this.isInitialized = true;
		}

		/** Add event */
		public AddEvent(event: any)
		{
			this.events.push(event);
		}

		/** Add load event */
		public AddLoadEvent(event: any)
		{
			this.events.push({url: event.url, type: 'load'});
		}

		/** Add click event */
		public AddClickEvent(event: any)
		{
			this.events.push({id: event.id, type: 'click'});
		}

		/** Add key event */
		public AddKeyEvent(event: any)
		{
			if (this.keyQueue.length === 0)
			{
				this.keyQueue.push({id: event.id, text: event.text});
				this.events.push({id: event.id, text: event.text, type: 'key'});
			}
			else if (this.keyQueue[this.keyQueue.length - 1].id == event.id)
			{
				this.events.pop();
				this.events.push({id: event.id, text: event.text, type: 'key'});
			}
		}
	}
}