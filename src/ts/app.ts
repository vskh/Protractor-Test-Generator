/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/chrome/chrome.d.ts"/>
/// <reference path="app/classes/_all.ts"/>
/// <reference path="app/services/_all.ts"/>
/// <reference path="app/controllers/_all.ts"/>
/// <reference path="app/directives/_all.ts"/>

module ExtensionApp
{
	angular.module('ExtensionApp',
		['ngRoute',
		'ExtensionApp.Controllers',
		'ExtensionApp.Services',
		'ui.bootstrap.contextMenu']).config(['$routeProvider',
		function($routeProvider)
		{
			$routeProvider.when('/setup',
			{
				templateUrl: 'views/intro.html',
				controller: ExtensionApp.Controllers.IntroController,
				controllerAs: 'vm'
			})
			.when('/tests',
			{
				templateUrl: 'views/tests.html',
				controller: ExtensionApp.Controllers.EventsController,
				controllerAs: 'vm'
			})
			.when('/preferences',
			{
				templateUrl: 'views/preferences.html',
				controller: ExtensionApp.Controllers.PreferencesController,
				controllerAs: 'vm'
			})
			.when('/save',
			{
				templateUrl: 'views/save.html',
				controller: ExtensionApp.Controllers.SaveController,
				controllerAs: 'vm'
			}).
			otherwise({
				redirectTo: '/setup'
			})
		}]).run(null);
	angular.module('ExtensionApp').constant('chrome', chrome);
}