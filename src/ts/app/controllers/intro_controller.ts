module ExtensionApp.Controllers
{
	/**
	 * Events Scope
	 */
	interface IntroScope extends ng.IScope
	{
		tab: any;
		url: string;
		initialized: boolean;
		propose: boolean;

		Initialize: any;
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
			/** If the chrome service is not initialized present the base page request experience. */
			if (!ChromeService.isInitialized)
			{
				$scope.initialized = false;
				$scope.propose = false;
				this.InitializeEventHandlers();
			}
			/** If the chrome service is initialized show the tab id and url to the user. */
			else
			{
				$scope.initialized = true;
				$scope.tab = this.ChromeService.testingTabId;
				$scope.url = this.ChromeService.events[0].url;
			}

			/** Initialize everything now that we know the base page and tab id. */
			$scope.Initialize = () =>
			{
				$scope.initialized = true;
				$scope.propose = false;
				this.ChromeService.Initialize($scope.tab);
				this.ChromeService.AddLoadEvent({url: $scope.url});
				this.ChromeService.InitializeEventListeners();
			}
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
							scope.tab = sender.tab.id;
							scope.url = msg.info.url;
							scope.propose = true;
							scope.$apply();
						}
					}
				}
			});
		}
	}
}