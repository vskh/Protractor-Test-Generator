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

		/** Current frame */
		private frameUrls: Array<{key: string, value: string}> = [];

		/** Current active frame */
		private currentFrame: any;

		/** Dependency injection. */
		static $inject = ['$rootScope', 'chrome'];

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
							if (CS.frameUrls.length != 0)
							{
								/** Comes from an internal frame that we haven't registered. Should be the deepest level. */
								let index = CS.frameUrls.map(function(obj){return obj.key;}).indexOf(CS.ExtractDomain(msg.info.url));
								if (index == -1)
								{
									let currentFrame = CS.frameUrls[CS.frameUrls.length - 1].value; 
									if (CS.currentFrame !== currentFrame)
									{
										CS.currentFrame = currentFrame;
										CS.AddIFrameSub({id: CS.currentFrame});
									}
								}
								/** Comes from a frame that was registered. */
								else if (index > 0)
								{
									let currentFrame = CS.frameUrls[index - 1].value;
									if (CS.currentFrame !== currentFrame)
									{
										CS.currentFrame = currentFrame;
										CS.AddIFrameSub({id:CS.currentFrame});
									}
								}
							}

							CS.AddClickEvent(msg.info);
						}
						/** Key up event */
						else if (msg.subject === 'text')
						{
							CS.AddKeyEvent(msg.info);
						}
						/** Enter event */
						else if (msg.subject === 'enter')
						{
							CS.AddEnterEvent({id: msg.info.id});
						}
						else if (msg.subject === 'iframesubload')
						{
							CS.currentFrame = msg.info.id;
							CS.frameUrls.push({key: CS.ExtractDomain(msg.info.url), value:msg.info.id});
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

		/** Add IFrame subload event */
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
			this.events.push({id: event.id, path: event.path, type: 'click'});
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
			this.events.push({id: event.id, text: event.text, path: event.path, className: event.className, type: 'key'});
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

		private ExtractDomain(url: string): string
		{
			var domain;
			//find & remove protocol (http, ftp, etc.) and get domain
			if (url.indexOf("://") > -1) {
				domain = url.split('/')[2];
			}
			else {
				domain = url.split('/')[0];
			}

			//find & remove port number
			domain = domain.split(':')[0];

			return domain;
		}
	}
}