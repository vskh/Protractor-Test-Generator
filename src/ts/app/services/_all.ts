/// <reference path="chrome_service.ts"/>
/// <reference path="template_service.ts"/>
module ExtensionApp.Services
{
	angular.module('ExtensionApp.Services', []);
	angular.module('ExtensionApp.Services').service('ChromeService', ChromeService);
	angular.module('ExtensionApp.Services').service('TemplateService', TemplateService);
}