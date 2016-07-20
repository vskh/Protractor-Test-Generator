var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        /** Event types */
        (function (EventType) {
            EventType[EventType["Load"] = 0] = "Load";
            EventType[EventType["Click"] = 1] = "Click";
            EventType[EventType["Focus"] = 2] = "Focus";
            EventType[EventType["Key"] = 3] = "Key";
        })(Controllers.EventType || (Controllers.EventType = {}));
        var EventType = Controllers.EventType;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        /** Outcome type */
        (function (OutcomeType) {
            OutcomeType[OutcomeType["NetworkCall"] = 0] = "NetworkCall";
            OutcomeType[OutcomeType["UXChange"] = 1] = "UXChange";
            OutcomeType[OutcomeType["URLChange"] = 2] = "URLChange";
        })(Controllers.OutcomeType || (Controllers.OutcomeType = {}));
        var OutcomeType = Controllers.OutcomeType;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        /** Abstract Event class */
        var Event = (function () {
            function Event() {
            }
            return Event;
        })();
        Controllers.Event = Event;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        /** Base class for different outcome types. */
        var Outcome = (function () {
            function Outcome() {
            }
            return Outcome;
        })();
        Controllers.Outcome = Outcome;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        /** Click event */
        var ClickEvent = (function (_super) {
            __extends(ClickEvent, _super);
            /** Make sure the event class + id + perhaps the element number is logged */
            function ClickEvent(elementId, elementClass) {
                _super.call(this);
                this.elementId = elementId;
                this.elementClass = elementClass;
                /** Click event type */
                this.type = Controllers.EventType.Click;
            }
            return ClickEvent;
        })(Controllers.Event);
        Controllers.ClickEvent = ClickEvent;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        /** Load event */
        var LoadEvent = (function (_super) {
            __extends(LoadEvent, _super);
            /** Constructor */
            function LoadEvent(loadUrl) {
                _super.call(this);
                this.loadUrl = loadUrl;
                /** Type is load */
                this.type = Controllers.EventType.Load;
            }
            return LoadEvent;
        })(Controllers.Event);
        Controllers.LoadEvent = LoadEvent;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        /** Load event */
        var KeyEvent = (function (_super) {
            __extends(KeyEvent, _super);
            /** Constructor */
            function KeyEvent(loadUrl) {
                _super.call(this);
                this.loadUrl = loadUrl;
                /** Type is load */
                this.type = Controllers.EventType.Key;
            }
            return KeyEvent;
        })(Controllers.Event);
        Controllers.KeyEvent = KeyEvent;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
/// <reference path="EventType.ts"/>
/// <reference path="OutcomeType.ts"/>
/// <reference path="Event.ts"/>
/// <reference path="Outcome.ts"/>
/// <reference path="ClickEvent.ts"/>
/// <reference path="LoadEvent.ts"/>
/// <reference path="KeyEvent.ts"/> 
var ExtensionApp;
(function (ExtensionApp) {
    var Services;
    (function (Services) {
        /**
         * Chrome service class.
         */
        var ChromeService = (function () {
            /**
             * Constructor for the chrome service.
             * @param $rootScope Scope
             * @param chrome Chrome runtime
             */
            function ChromeService($rootScope, chrome) {
                this.$rootScope = $rootScope;
                this.chrome = chrome;
                /** Events array */
                this.events = [];
                /** Key queue */
                this.keyQueue = [];
                this.isInitialized = false;
            }
            /**
             * Clear all.
             */
            ChromeService.prototype.ClearAll = function () {
                this.testingTabId = undefined;
                this.isInitialized = false;
                this.events = [];
                this.keyQueue = [];
            };
            /**
             * Ensure that we're only looking to the same tab
             * and registering events from that tab
             */
            ChromeService.prototype.Initialize = function (tabId) {
                this.testingTabId = tabId;
                this.isInitialized = true;
            };
            /** Initialize the event listeners. */
            ChromeService.prototype.InitializeEventListeners = function () {
                var CS = this;
                var RS = this.$rootScope;
                this.chrome.runtime.onMessage.addListener(function (msg, sender, response) {
                    /** If the sender is content script and the tab is the one that we're tracking */
                    if (msg.from === 'content' && sender.tab.id === CS.testingTabId) {
                        if (msg.subject) {
                            /** Page load */
                            if (msg.subject === 'load') {
                                CS.AddLoadEvent({ url: msg.info.url });
                            }
                            else if (msg.subject === 'click') {
                                CS.AddClickEvent({ id: msg.info.id });
                            }
                            else if (msg.subject === 'text') {
                                CS.AddKeyEvent({ id: msg.info.id, text: msg.info.text });
                            }
                            else if (msg.subject === 'enter') {
                                CS.AddEnterEvent({ id: msg.info.id });
                            }
                        }
                    }
                    else if (msg.from === 'background') {
                        /** Ensure event */
                        if (msg.subject === 'ensure') {
                            CS.AddEnsureEvent({ id: msg.info.id });
                        }
                        /**  */
                        if (msg.subject) {
                            if (msg.subject === 'UrlChange') {
                            }
                        }
                    }
                    RS.$apply();
                });
            };
            /** Add event */
            ChromeService.prototype.AddEvent = function (event) {
                this.events.push(event);
            };
            /** Add load event */
            ChromeService.prototype.AddLoadEvent = function (event) {
                this.events.push({ url: event.url, type: 'load' });
            };
            /** Add click event */
            ChromeService.prototype.AddClickEvent = function (event) {
                this.events.push({ id: event.id, type: 'click' });
            };
            /** Add ensure event */
            ChromeService.prototype.AddEnsureEvent = function (event) {
                this.events.push({ id: event.id, type: 'ensure', testtype: 'ensure' });
            };
            /** Add key event */
            ChromeService.prototype.AddKeyEvent = function (event) {
                if (this.keyQueue.length === 0) {
                    this.keyQueue.push({ id: event.id, text: event.text });
                    this.events.push({ id: event.id, text: event.text, type: 'key' });
                }
                else if (this.keyQueue[this.keyQueue.length - 1].id == event.id) {
                    this.events.pop();
                    this.events.push({ id: event.id, text: event.text, type: 'key' });
                }
            };
            /** Add Enter key event. */
            ChromeService.prototype.AddEnterEvent = function (event) {
                this.events.push({ id: event.id, type: 'enter' });
            };
            /** Remove event */
            ChromeService.prototype.RemoveEvent = function (index) {
                if (index === 0 || this.events.length === 0) {
                    return;
                }
                this.events.splice(index, 1);
            };
            /** Dependency injection. */
            ChromeService.$inject = ['$rootScope', 'chrome'];
            return ChromeService;
        })();
        Services.ChromeService = ChromeService;
    })(Services = ExtensionApp.Services || (ExtensionApp.Services = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Services;
    (function (Services) {
        /** Template service */
        var TemplateService = (function () {
            /**
             * Constructor
             * @param chrome extension access
             * @param ChromeService chrome service
             */
            function TemplateService(chrome, ChromeService) {
                this.chrome = chrome;
                this.ChromeService = ChromeService;
            }
            /** Get file template */
            TemplateService.prototype.GetFileTemplate = function () {
                var fileTemplateUrl = chrome.extension.getURL('templates/file_template.js');
                return this.readTextFile(fileTemplateUrl);
            };
            /** Get test template */
            TemplateService.prototype.GetTestTemplate = function () {
                var fileTemplateUrl = chrome.extension.getURL('templates/test_template.js');
                return this.readTextFile(fileTemplateUrl);
            };
            /** Compose file */
            TemplateService.prototype.ComposeFile = function (testName) {
                var fileTemplate = this.GetFileTemplate();
                /** File template replacement tags */
                var testNameReplace = '%NAME%';
                fileTemplate = fileTemplate.replace(testNameReplace, testName) + "%0A%09";
                var testTemplate = '%TESTTEMPLATE%';
                fileTemplate = fileTemplate.replace(testTemplate, this.ComposeTests()) + "%0A%09";
                return fileTemplate;
            };
            /** Compose the tests */
            TemplateService.prototype.ComposeTests = function () {
                var testTemplate = this.GetTestTemplate();
                /** Test template replacement tags */
                var test = '%TEST%';
                var internalTests = this.ComposeSteps();
                testTemplate = testTemplate.replace(test, internalTests);
                return testTemplate;
            };
            /** Compose the steps */
            TemplateService.prototype.ComposeSteps = function () {
                var _this = this;
                var tests = "";
                this.ChromeService.events.forEach(function (value, index) {
                    if (value.type === 'load') {
                        // Replace with proper browser.get condition adding.
                        tests += _this.AddBrowserGetStep(value.url);
                    }
                    else if (value.type === 'click') {
                        // Click step registry
                        tests += _this.AddClickStep(value.id, value.css);
                    }
                    else if (value.type === 'key') {
                        // Key step registry
                        tests += _this.AddTypeInStep(value.id, value.text);
                    }
                    else if (value.type === 'enter') {
                        // Enter step registry
                        tests += _this.AddEnterStep(value.id);
                    }
                    else if (value.type === 'ensure') {
                        // Add ensure test
                        tests += _this.AddEnsureTest(value.id);
                    }
                    tests = tests + "%0A%09";
                });
                return tests;
            };
            /** Download file */
            TemplateService.prototype.DownloadFile = function (testName) {
                var fileData = this.ComposeFile(testName);
                chrome.downloads.download({
                    url: "data:text/plain," + fileData,
                    // Provide initial name to be tests.js
                    filename: 'tests.js',
                    conflictAction: "prompt",
                    // Open save as dialog
                    saveAs: true
                }, function (downloadId) {
                    console.log("Downloaded item with ID", downloadId);
                });
            };
            /** Format string */
            TemplateService.prototype.formatString = function (format) {
                var params = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    params[_i - 1] = arguments[_i];
                }
                var args = Array.prototype.slice.call(arguments, 1);
                return format.replace(/{(\d+)}/g, function (match, number) {
                    return typeof args[number] != 'undefined'
                        ? args[number]
                        : match;
                });
            };
            ;
            /** Read file */
            TemplateService.prototype.readTextFile = function (file) {
                var rawFile = new XMLHttpRequest();
                var allText;
                rawFile.open("GET", file, false);
                rawFile.onreadystatechange = function () {
                    if (rawFile.readyState === 4) {
                        if (rawFile.status === 200 || rawFile.status == 0) {
                            allText = rawFile.responseText;
                        }
                    }
                };
                rawFile.send(null);
                return allText;
            };
            /** Browser get step */
            TemplateService.prototype.AddBrowserGetStep = function (url) {
                /** Get url template */
                return this.formatString("browser.get('{0}');", url);
            };
            /** Click step */
            TemplateService.prototype.AddClickStep = function (id, css) {
                if (id && id.length > 0) {
                    return this.formatString("element(by.id('{0}')).click();", id);
                }
                else if (css && css.length > 0) {
                    return this.formatString("element(by.css('{0}')).click();", css);
                }
            };
            /** Add enter step */
            TemplateService.prototype.AddEnterStep = function (id) {
                if (id && id.length > 0) {
                    return this.formatString("element(by.id('{0}')).sendKeys(protractor.Key.ENTER);");
                }
            };
            /** Type in step */
            TemplateService.prototype.AddTypeInStep = function (id, text) {
                if (id && id.length > 0) {
                    return this.formatString("element(by.id('{0}')).sendKeys('{1}');", id, text);
                }
            };
            /** Add ensure test */
            TemplateService.prototype.AddEnsureTest = function (id) {
                if (id && id.length > 0) {
                    return this.formatString("expect(element(by.id('{0}')).isPresent()).toBeTruthy();");
                }
            };
            /** Dependency injection */
            TemplateService.$inject = ['chrome', 'ChromeService'];
            return TemplateService;
        })();
        Services.TemplateService = TemplateService;
    })(Services = ExtensionApp.Services || (ExtensionApp.Services = {}));
})(ExtensionApp || (ExtensionApp = {}));
/// <reference path="chrome_service.ts"/>
/// <reference path="template_service.ts"/>
var ExtensionApp;
(function (ExtensionApp) {
    var Services;
    (function (Services) {
        angular.module('ExtensionApp.Services', []);
        angular.module('ExtensionApp.Services').service('ChromeService', Services.ChromeService);
        angular.module('ExtensionApp.Services').service('TemplateService', Services.TemplateService);
    })(Services = ExtensionApp.Services || (ExtensionApp.Services = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        var IntroController = (function () {
            /**
             * Constructor for events controller.
             * @param $scope the scope
             * @param ChromeService chrome service
             */
            function IntroController($scope, ChromeService, TemplateService, chrome) {
                this.$scope = $scope;
                this.ChromeService = ChromeService;
                this.TemplateService = TemplateService;
                this.chrome = chrome;
                /** If the chrome service is not initialized present the base page request experience. */
                if (!ChromeService.isInitialized) {
                    this.initialized = false;
                    this.propose = false;
                    this.InitializeEventHandlers();
                }
                else {
                    this.initialized = true;
                    this.tab = this.ChromeService.testingTabId;
                    this.url = this.ChromeService.events[0].url;
                }
            }
            /**
             * Initialize everything now that we know the base page and tab id.
             */
            IntroController.prototype.Initialize = function () {
                this.initialized = true;
                this.propose = false;
                this.ChromeService.Initialize(this.tab);
                this.ChromeService.AddLoadEvent({ url: this.url });
                this.ChromeService.InitializeEventListeners();
            };
            /**
             * Initialize event handlers
             */
            IntroController.prototype.InitializeEventHandlers = function () {
                var controller = this;
                this.chrome.runtime.onMessage.addListener(function TemporaryListener(msg, sender, response) {
                    /** If the sender is content script */
                    if (controller.ChromeService.isInitialized) {
                        controller.chrome.runtime.onMessage.removeListener(TemporaryListener);
                        return;
                    }
                    if (msg.from === 'content') {
                        if (msg.subject) {
                            /** Page load */
                            if (msg.subject === 'load') {
                                controller.tab = sender.tab.id;
                                controller.url = msg.info.url;
                                controller.propose = true;
                                controller.$scope.$apply();
                            }
                        }
                    }
                });
            };
            /**
             * Clear all
             */
            IntroController.prototype.ClearAll = function () {
                this.initialized = false;
                this.propose = false;
                this.ChromeService.ClearAll();
                this.$scope.$apply();
            };
            /**
             * Dependency injection.
             */
            IntroController.$inject = ['$scope', 'ChromeService', 'TemplateService', 'chrome'];
            return IntroController;
        })();
        Controllers.IntroController = IntroController;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        /**
         * Events controller class.
         */
        var EventsController = (function () {
            /**
             * Constructor for events controller.
             * @param ChromeService chrome service
             */
            function EventsController(ChromeService) {
                this.ChromeService = ChromeService;
                /**
                 * Menu options
                 */
                this.menuOptions = [
                    ['Mark as Setup', function ($itemScope) {
                            $itemScope.event.testtype = 'setup';
                        }, [
                            ['Mark as Setup and Edit', function ($itemScope) {
                                    $itemScope.event.testtype = 'setup';
                                }]]], null,
                    ['Mark as Step', function ($itemScope) {
                            $itemScope.event.testtype = 'step';
                        }], null,
                    ['Mark as Test', function ($itemScope) {
                            $itemScope.event.testtype = 'test';
                        }], null,
                    ['Mark as Result', function ($itemScope) {
                            $itemScope.event.testtype = 'result';
                        }]
                ];
                this.events = this.ChromeService.events;
            }
            /**
             * Remove event from the chrome service.
             * @param index Index to remove.
             */
            EventsController.prototype.RemoveEvent = function (index) {
                this.ChromeService.RemoveEvent(index);
            };
            /**
             * Dependency injection.
             */
            EventsController.$inject = ['ChromeService'];
            return EventsController;
        })();
        Controllers.EventsController = EventsController;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        var NavbarController = (function () {
            /**
             * Constructor for the controller
             */
            function NavbarController($scope, $location) {
                this.$scope = $scope;
                this.$location = $location;
                $scope.isActive = function (viewLocation) {
                    if ($location.path().indexOf('demo') >= 0) {
                        return false;
                    }
                    return $location.path().indexOf(viewLocation) >= 0;
                };
                $scope.Back = function () {
                    window.history.back();
                };
            }
            /** dependency injection */
            NavbarController.$inject = ['$scope', '$location'];
            return NavbarController;
        })();
        Controllers.NavbarController = NavbarController;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        /**
         * Preferences controller
         */
        var PreferencesController = (function () {
            /** Preferences controller */
            function PreferencesController($scope, TemplateService) {
                this.TemplateService = TemplateService;
                $scope.Download = function () {
                    //TemplateService.ComposeFile();
                };
            }
            /** Dependency injection */
            PreferencesController.$inject = ['$scope', 'TemplateService'];
            return PreferencesController;
        })();
        Controllers.PreferencesController = PreferencesController;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        /** Save controller */
        var SaveController = (function () {
            /**
             * Constructor for save controller
             * @param TemplateService Template Service for accessing templates and saving files.
             */
            function SaveController(TemplateService) {
                this.TemplateService = TemplateService;
            }
            /**
             * Download the test file
             */
            SaveController.prototype.Download = function () {
                this.TemplateService.DownloadFile(this.testName && this.testName.length > 0 ? this.testName : 'Recorded Test');
            };
            /** Dependency injection */
            SaveController.$inject = ['TemplateService'];
            return SaveController;
        })();
        Controllers.SaveController = SaveController;
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
/// <reference path="intro_controller.ts"/>
/// <reference path="events_controller.ts"/>
/// <reference path="navbar_controller.ts"/>
/// <reference path="preferences_controller.ts"/>
/// <reference path="save_controller.ts"/>
var ExtensionApp;
(function (ExtensionApp) {
    var Controllers;
    (function (Controllers) {
        angular.module('ExtensionApp.Controllers', []);
        angular.module('ExtensionApp.Controllers').controller('IntroController', Controllers.IntroController);
        angular.module('ExtensionApp.Controllers').controller('EventsController', Controllers.EventsController);
        angular.module('ExtensionApp.Controllers').controller('NavbarController', Controllers.NavbarController);
        angular.module('ExtensionApp.Controllers').controller('PreferencesController', Controllers.PreferencesController);
        angular.module('ExtensionApp.Controllers').controller('SaveController', Controllers.SaveController);
    })(Controllers = ExtensionApp.Controllers || (ExtensionApp.Controllers = {}));
})(ExtensionApp || (ExtensionApp = {}));
/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="../../typings/chrome/chrome.d.ts"/>
/// <reference path="app/classes/_all.ts"/>
/// <reference path="app/services/_all.ts"/>
/// <reference path="app/controllers/_all.ts"/>
var ExtensionApp;
(function (ExtensionApp) {
    angular.module('ExtensionApp', ['ngRoute',
        'ExtensionApp.Controllers',
        'ExtensionApp.Services',
        'ui.bootstrap.contextMenu']).config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/setup', {
                templateUrl: 'views/intro.html',
                controller: ExtensionApp.Controllers.IntroController,
                controllerAs: 'vm'
            })
                .when('/tests', {
                templateUrl: 'views/tests.html',
                controller: ExtensionApp.Controllers.EventsController,
                controllerAs: 'vm'
            })
                .when('/preferences', {
                templateUrl: 'views/preferences.html',
                controller: ExtensionApp.Controllers.PreferencesController,
                controllerAs: 'vm'
            })
                .when('/save', {
                templateUrl: 'views/save.html',
                controller: ExtensionApp.Controllers.SaveController,
                controllerAs: 'vm'
            }).
                otherwise({
                redirectTo: '/setup'
            });
        }]).run(function () {
        console.log('running the app');
    });
    angular.module('ExtensionApp').constant('chrome', chrome);
})(ExtensionApp || (ExtensionApp = {}));
