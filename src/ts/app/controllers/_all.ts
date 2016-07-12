/// <reference path="intro_controller.ts"/>
/// <reference path="events_controller.ts"/>
/// <reference path="navbar_controller.ts"/>
/// <reference path="preferences_controller.ts"/>
/// <reference path="save_controller.ts"/>
module ExtensionApp.Controllers
{
	angular.module('ExtensionApp.Controllers', []);
	angular.module('ExtensionApp.Controllers').controller('IntroController', IntroController);
	angular.module('ExtensionApp.Controllers').controller('EventsController', EventsController);
	angular.module('ExtensionApp.Controllers').controller('NavbarController', NavbarController);
	angular.module('ExtensionApp.Controllers').controller('PreferencesController', PreferencesController);
	angular.module('ExtensionApp.Controllers').controller('SaveController', SaveController);
}
