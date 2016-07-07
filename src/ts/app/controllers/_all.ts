/// <reference path="events_controller.ts"/>
/// <reference path="navbar_controller.ts"/>
/// <reference path="preferences_controller.ts"/>
module ExtensionApp.Controllers
{
	angular.module('ExtensionApp.Controllers', []);
	angular.module('ExtensionApp.Controllers').controller('EventsController', EventsController);
	angular.module('ExtensionApp.Controllers').controller('NavbarController', NavbarController);
	angular.module('ExtensionApp.Controllers').controller('PreferencesController', PreferencesController);
}
