module ExtensionApp.Services
{
	/**
	 * Chrome service class.
	 */
	export class ChromeService
	{
		/** Events array */
		public events = [];

		/** If the service is initialized */
		public isInitialized: boolean;

		/** Chrome tab id */
		public testingTabId: any;

		/** Last load event index */
		private lastLoadEventIndex: number;

		/** Dependency injection. */
		static $inject = ['$rootScope', 'chrome'];

		public frameStack = {};

		/**
		 * Constructor for the chrome service.
		 * @param $rootScope Scope
		 * @param chrome Chrome runtime
		 */
		constructor(private $rootScope: ng.IRootScopeService, private chrome: any)
		{
			this.isInitialized = false;
		}

		/**
		 * Clear all.
		 */
		public ClearAll()
		{
			this.testingTabId = undefined;
			this.isInitialized = false;
			this.events = [];
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

		/** Initialize the event listeners. */
		public InitializeEventListeners()
		{
			var CS = this;
			var RS = this.$rootScope;
			this.chrome.runtime.onMessage.addListener(function (msg, sender, response) {

				/** If the sender is content script and the tab is the one that we're tracking */
				if (msg.from === 'content' && sender.tab.id === CS.testingTabId)
				{
					if (msg.subject)
					{
						/** Page load */
						if (msg.subject === 'load')
						{
							let tabUrl = sender.tab.url;
							if (tabUrl === msg.info.url)
							{
								CS.AddLoadEvent({url: msg.info.url});
							}
							// IFrame or some other async initialization.
							else
							{
								CS.AddPartialLoadEvent({url: msg.info.url});
							}
						}
						/** Click event */
						else if (msg.subject === 'click')
						{
							CS.AddClickEvent({id: msg.info.id, name: msg.info.name, className: msg.info.className});
						}
						/** Key up event */
						else if (msg.subject === 'text')
						{
							CS.AddKeyEvent({id: msg.info.id, text: msg.info.text, name: msg.info.name, className: msg.info.className});
						}
						/** Enter event */
						else if (msg.subject === 'enter')
						{
							CS.AddEnterEvent({id: msg.info.id});
						}
						else if (msg.subject === 'iframesubload')
						{
							CS.AddIFrameSub({id: msg.info.id, url: msg.info.url});
						}
					}
				}
				else if (msg.from === 'background')
				{
					/** Ensure event */
					if(msg.subject === 'ensure')
					{
						CS.AddEnsureEvent({id: msg.info.id})
					}
					/**  */
					if (msg.subject)
					{
						if (msg.subject === 'UrlChange')
						{
							//_ChromeService.AddEvent()
						}
					}
				}
				RS.$apply();
			});
		}

		/** Add event */
		public AddEvent(event: any)
		{
			this.events.push(event);
		}

		public AddIFrameSub(event: any)
		{
			this.events.push({id: event.id, type: 'iframesubload', url: event.url})
		}

		/** Add partial load event */
		public AddPartialLoadEvent(event: any)
		{
			let partials = this.events[this.lastLoadEventIndex].partials;
			if (!partials)
			{
				this.events[this.lastLoadEventIndex].partials = [];
			}
			this.events[this.lastLoadEventIndex].partials.push({url: event.url});
		}

		/** Add load event */
		public AddLoadEvent(event: any)
		{
			this.events.push({url: event.url, type: 'load'});
			// last index
			this.lastLoadEventIndex = this.events.length -1 ;
		}

		/** Add click event */
		public AddClickEvent(event: any)
		{
			this.events.push({id: event.id, name: event.name, className: event.className, type: 'click'});
		}

		/** Add ensure event */
		public AddEnsureEvent(event:any): void
		{
			this.events.push({id: event.id, type: 'ensure', testtype: 'ensure'});
		}

		/** Add key event */
		public AddKeyEvent(event: any): void
		{
			if (this.events[this.events.length - 1].id == event.id)
			{
				this.events.pop();
			}
			this.events.push({id: event.id, text: event.text, name: event.name, className: event.className, type: 'key'});
		}

		/** Add Enter key event. */
		public AddEnterEvent(event: any): void
		{
			this.events.push({id: event.id, type: 'enter'});
		}

		/** Remove event */
		public RemoveEvent(index: number): void
		{
			if (index === 0 || this.events.length === 0)
			{
				return;
			}

			this.events.splice(index, 1);
		}
	}
}