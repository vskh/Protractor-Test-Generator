module ExtensionApp.Controllers
{
	/**
	 * Events Scope
	 */
	interface IntroScope extends ng.IScope
	{
		events: any;
		navigation: string;
		selection: string;
		menuOptions: any;
		tab: any;
		url: string;
		initialized: boolean;
	}

	export class IntroController
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
		constructor(private $scope: IntroScope, private ChromeService: Services.ChromeService, private chrome: any)
		{
			/*if (!ChromeService.initialized)
			{*/
				this.InitializeEventHandlers();
				//ChromeService.initialized = true;
		//	}
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
							_ChromeService.Initialize(sender.tab.id);
							scope.tab = sender.tab.id;
							scope.url = msg.info.url;
							scope.initialized = true;
							_ChromeService.AddLoadEvent({url: msg.info.url});
							scope.$apply();
						}
					}
				}

				/*scope.events = _ChromeService.events;
				scope.$apply();*/
			});
		}
	}
}