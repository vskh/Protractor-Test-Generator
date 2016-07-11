/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/chrome/chrome.d.ts"/>
/// <reference path="app/classes/_all.ts"/>
/// <reference path="app/services/_all.ts"/>
/// <reference path="app/controllers/_all.ts"/>

module ExtensionApp
{
	angular.module('ExtensionApp',
	['ngRoute', 'ExtensionApp.Controllers', 'ExtensionApp.Services', 'ui.bootstrap.contextMenu']).config(['$routeProvider',
		function($routeProvider)
		{
			$routeProvider.when('/setup',
			{
				templateUrl: 'build/views/intro.html',
				controller: ExtensionApp.Controllers.IntroController
			})
			.when('/tests',
			{
				templateUrl: 'build/views/tests.html',
				controller: ExtensionApp.Controllers.EventsController
			})
			.when('/preferences',
			{
				templateUrl: 'build/views/preferences.html',
				controller: ExtensionApp.Controllers.PreferencesController
			}).
			otherwise({
				redirectTo: '/setup'
			})
		}]).run(() =>
		{
			console.log('running the app');
		});
	angular.module('ExtensionApp').constant('chrome', chrome);
}