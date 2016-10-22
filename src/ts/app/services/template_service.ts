module ExtensionApp.Services {
    /** Template service */
    export abstract class TemplateService {
        /** Dependency injection */
        static $inject: string[] = ['chrome', 'ChromeService'];

        /**
         * Constructor
         * @param chrome extension access
         * @param ChromeService chrome service
         */
        constructor(private chrome: any, private ChromeService: ChromeService) {
        }

        /** Get file template */
        private GetFileTemplate(): string {
            var fileTemplateUrl: string = chrome.extension.getURL('templates/file_template.js');
            return this.readTextFile(fileTemplateUrl);
        }

        /** Get test template */
        private GetTestTemplate(): string {
            var fileTemplateUrl: string = chrome.extension.getURL('templates/test_template.js');
            return this.readTextFile(fileTemplateUrl);
        }

        /** Compose file */
        public ComposeFile(testName: string): string {
            var fileTemplate = this.GetFileTemplate();

            /** File template replacement tags */
            var globalDefsPlaceholder: string = "%GLOBALDEFINITIONS%";
            fileTemplate = fileTemplate.replace(globalDefsPlaceholder, this.ComposeGlobalDefinitions());

            var testNameReplace: string = '%NAME%';
            fileTemplate = fileTemplate.replace(testNameReplace, testName) + "\n";

            var testTemplate: string = '%TESTTEMPLATE%';
            fileTemplate = fileTemplate.replace(testTemplate, this.ComposeTestsSettings() + this.ComposeTests()) + "%0A%09";

            return fileTemplate;
        }

        protected ComposeGlobalDefinitions(): string {
            return "";
        }

        protected ComposeTestsSettings(): string {
            return  `browser.timeouts('implicit', 2000);\n` +
                    `browser.timeouts('page load', 5000);\n`;
        }

        /** Compose the tests */
        private ComposeTests(): string {
            var testTemplate = this.GetTestTemplate();

            /** Test template replacement tags */
            var test: string = '%TEST%';
            var internalTests = this.ComposeSteps();
            testTemplate = testTemplate.replace(test, internalTests);

            return testTemplate;
        }

        /** Compose the steps */
        private ComposeSteps(): string {
            var tests: string = "";
            var currentIndent = 1;
            this.ChromeService.events.forEach((value: any, index: number) => {
                tests += "\t\t";
                /*if (currentIndent != value.indent)
                 {

                 }*/
                if (value.testtype === 'test' && value.type === 'load') {
                    // Verify if the url is changing.
                    tests += this.AddUrlChangeTest(value.url);
                }
                else if (value.type === 'load') {
                    // Replace with proper browser.get condition adding.
                    tests += this.AddBrowserGetStep(value.url);
                }
                else if (value.type === 'click') {
                    // Click step registry
                    tests += this.AddClickStep(value.id, value.path);
                }
                else if (value.type === 'key') {
                    // Key step registry
                    tests += this.AddTypeInStep(value.id, value.path, value.text);
                }
                else if (value.type === 'enter') {
                    // Enter step registry
                    tests += this.AddEnterStep(value.id);
                }
                else if (value.type === 'ensure') {
                    // Add ensure test
                    tests += this.AddEnsureTest(value.id, value.path);
                }
                else if (value.type === 'iframesubload') {
                    // Switch context to iframe
                    tests += this.SwitchToIFrameContext(value.id);
                }
            });

            return tests;
        }

        /** Download file */
        public DownloadFile(testName: string) {
            var fileData: string = this.ComposeFile(testName);
            chrome.downloads.download({
                url: "data:text/plain," + fileData,
                // Provide initial name to be tests.js
                filename: 'tests.js',
                conflictAction: "prompt",
                // Open save as dialog
                saveAs: true,
            }, function (downloadId) {
                console.log("Downloaded item with ID", downloadId);
            });
        }

        /** Format string */
        protected formatString(format: string, ...params): string {
            var args = Array.prototype.slice.call(arguments, 1);
            return format.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined'
                    ? args[number]
                    : match;
            });
        };

        /** Read file */
        private readTextFile(file): string {
            var rawFile = new XMLHttpRequest();
            var allText: string = undefined;
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
        }

        /** Browser get step */
        protected abstract AddBrowserGetStep(url: string): string;

        /** Click step */
        protected abstract AddClickStep(id: string, path: string): string;

        /** Add enter step */
        protected abstract AddEnterStep(id: string): string;

        /** Type in step */
        protected abstract AddTypeInStep(id: string, path: string, text: string): string;

        /** Add ensure test */
        protected abstract AddEnsureTest(id: string, path: string): string;

        /** Switch to iframe context */
        protected abstract SwitchToIFrameContext(id: string): string;

        /** Add url change test */
        protected abstract AddUrlChangeTest(url: string): string;
    }

    export class ProtractorTemplateService extends TemplateService {

        protected ComposeGlobalDefinitions(): string {
            return `var urlChanged = function(url) {` +
                   `   return function () {` +
                   `     return browser.getCurrentUrl().then(function(actualUrl) {` +
                   `      return url != actualUrl;` +
                   `     });` +
                   `   };` +
                   `};`;
        }

        protected ComposeTestsSettings(): string {
            return "browser.ignoreSynchronization = true;\n";
        }

        /** Browser get step */
        protected AddBrowserGetStep(url: string): string {
            /** Get url template */
            return this.formatString("browser.get('{0}');%0A", url);
        }

        /** Click step */
        protected AddClickStep(id: string, path: string): string {
            if (id && id.length > 0) {
                return this.formatString("element(by.id('{0}')).click();%0A", id);
            }
            else if (path && path.length > 0) {
                return this.formatString("element(by.css('{0}')).click();%0A", path);
            }
        }

        /** Add enter step */
        protected AddEnterStep(id: string): string {
            if (id && id.length > 0) {
                return this.formatString("element(by.id('{0}')).sendKeys(protractor.Key.ENTER);%0A", id);
            }
        }

        /** Type in step */
        protected AddTypeInStep(id: string, path: string, text: string): string {
            if (id && id.length > 0) {
                return this.formatString("element(by.id('{0}')).sendKeys('{1}');%0A", id, text);
            }
            else if (path && path.length > 0) {
                return this.formatString("element(by.css('{0}')).sendKeys('{1}');%0A", path, text);
            }
        }

        /** Add ensure test */
        protected AddEnsureTest(id: string, path: string): string {
            if (id && id.length > 0) {
                return this.formatString("expect(element(by.id('{0}')).isPresent()).toBeTruthy();%0A", id);
            }
            else if (path && path.length > 0) {
                return this.formatString("expect(element(by.css('{0}')).isPresent()).toBeTruthy();%0A", path);
            }
        }

        /** Switch to iframe context */
        protected SwitchToIFrameContext(id: string): string {
            if (id && id.length > 0) {
                let result = "browser.wait(protractor.ExpectedConditions.presenceOf(element(by.id('{0}'))), 2000);%0A";
                result += "%09%09" + this.AddEnsureTest(id, undefined);
                result += "%09%09" + "browser.switchTo().frame('{0}');%0A"
                return this.formatString(result, id);
            }
        }

        /** Add url change test */
        protected AddUrlChangeTest(url: string): string {
            return this.formatString("browser.wait(urlChanged('{0}'), 5000)", url);
        }
    }

    export class WebdriverIOTemplateService extends TemplateService {
        protected ComposeGlobalDefinitions(): string {
            return  `var urlChanged = function(url) {\n` +
                    `   return browser.url() === url;\n` +
                    `};\n`;
        }

        protected AddBrowserGetStep(url: string): string {
            return this.formatString("browser.url('{0}');\n", url);
        }

        protected AddClickStep(id: string, path: string): string {
            if (id && id.length > 0) {
                return this.formatString("browser.click('#{0}');\n", id);
            }
            else if (path && path.length > 0) {
                return this.formatString("browser.click('{0}');\n", path);
            }
            else {
                return "\/\/ AddClickStep failed due to the missing element selector;\n";
            }
        }

        protected AddEnterStep(id: string): string {
            if (id && id.length > 0) {
                return this.formatString("browser.element('#{0}').keys('Enter');\n", id);
            }
            else {
                return "\/\/ AddEnterStep failed due to the missing element selector;\n";
            }
        }

        protected AddTypeInStep(id: string, path: string, text: string): string {
            if (id && id.length > 0) {
                return this.formatString("browser.setValue('#{0}', '{1}');\n", id, text);
            }
            else if (path && path.length > 0) {
                return this.formatString("browser.element('{0}', '{1}');\n", path, text);
            }
            else {
                return "\/\/ AddTypeInStep failed due to the missing element selector;\n";
            }
        }

        protected AddEnsureTest(id: string, path: string): string {
            if (id && id.length > 0) {
                return this.formatString("expect(browser.isExisting('#{0}')).toBeTruthy();\n", id);
            }
            else if (path && path.length > 0) {
                return this.formatString("expect(browser.isExisting('{0}')).toBeTruthy();\n", path);
            }
            else {
                return "\/\/ AddEnsureTest failed due to the missing element selector;\n";
            }
        }

        /** Switch to iframe context */
        protected SwitchToIFrameContext(id: string): string {
            if (id && id.length > 0) {
                let result = "browser.waitForExist('#{0}', 2000);\n";
                result += "\t\t" + this.AddEnsureTest(id, undefined);
                result += "\t\t" + "browser.frame('#{0}');\n";
                return this.formatString(result, id);
            }
            else {
                return "\/\/ SwitchToIFrameContext failed due to the missing element selector;\n";
            }
        }

        /** Add url change test */
        protected AddUrlChangeTest(url: string): string {
            return this.formatString("browser.waitUntil(urlChanged('{0}'), 5000)", url);
        }
    }
}
