module ExtensionApp.Services
{
	/** Template service */
	export class TemplateService
	{
		

		/** Element template */
		private elementTemplate: string = "element({0})";



		/** Dependency injection */
		static $inject: string[] = ['chrome', 'ChromeService'];

		/**
		 * Constructor
		 * @param chrome extension access
		 * @param ChromeService chrome service
		 */
		constructor(private chrome: any, private ChromeService: ChromeService)
		{
		}

		/** Get file template */
		private GetFileTemplate(): string {
			var fileTemplateUrl: string = chrome.extension.getURL('templates/file_template.js');
			return this.readTextFile(fileTemplateUrl);
		}

		/** Compose file */
		public ComposeFile(testName: string): string
		{
			var fileTemplate = this.GetFileTemplate();

			/** File template replacement tags */
			var testNameReplace: string = '%NAME%';
			fileTemplate = fileTemplate.replace(testNameReplace, testName);

			var internalTests = this.ComposeTests();
			var testTemplate: string = '%TESTTEMPLATE%';
			fileTemplate = fileTemplate.replace(testTemplate, internalTests);
			
			return fileTemplate;
		}

		/** Compose the tests */
		private ComposeTests(): string	{
			var tests: string = "";
			this.ChromeService.events.forEach((value: any, index: number) => {
				if (value.type === 'load')
				{
					// Replace with proper browser.get condition adding.
					tests += this.AddBrowserGetStep(value.url);
				}
				else if (value.type === 'click')
				{
					// Click step registry
					tests += this.AddClickStep(value.id, value.css);
				}
			});
			return tests;
		}

		/** Download file */
		public DownloadFile(testName: string) {
			var fileData: string = this.ComposeFile(testName);
			chrome.downloads.download({
				url: "data:text/plain," + fileData,
				// Provide initial name to be protractor.js
				filename: 'protractor.js',
				conflictAction: "prompt",
				// Open save as dialog
				saveAs: true,
				}, function(downloadId) {
					console.log("Downloaded item with ID", downloadId);
			});
		}

		/** Format string */
		private formatString(format: string, ...params): string {
			var args = Array.prototype.slice.call(arguments, 1);
			return format.replace(/{(\d+)}/g, function(match, number) { 
			return typeof args[number] != 'undefined'
				? args[number] 
				: match;
			});
		};

		/** Read file */
		private readTextFile(file): string {
			var rawFile = new XMLHttpRequest();
			var allText: string;
			rawFile.open("GET", file, false);
			rawFile.onreadystatechange = function ()
			{
				if(rawFile.readyState === 4)
				{
					if(rawFile.status === 200 || rawFile.status == 0)
					{
						allText = rawFile.responseText;
					}
				}
			}

			rawFile.send(null);
			return allText;
		}

		/** Browser get step */
		private AddBrowserGetStep(url: string): string {
			/** Get url template */
			return this.formatString("browser.get('{0}');", url);
		}

		/** Click step */
		private AddClickStep(id: string, css: string) : string {
			if (id && id.length > 0)
			{
				return this.formatString("element(by.id('{0}')).click();", id);
			}
			else if (css && css.length > 0)
			{
				return this.formatString("element(by.css('{0}')).click();", css);
			}
		}

		/** Type in step */
		private TypeInStep(id: string, text: string): string {
			if (id && id.length > 0)
			{
				return this.formatString("element(by.id('{0}}')).sendKeys('{1}');", id, text);
			}
		}
	}
}