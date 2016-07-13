module ExtensionApp.Services
{
	/** Template service */
	export class TemplateService
	{
		/** Dependency injection */
		static $inject: string[] = ['chrome', 'ChromeService'];

		/**
		 * Constructor
		 * @param chrome extension access
		 */
		constructor(private chrome: any)
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

			var testTemplate: string = '%TESTTEMPLATE%';
			return fileTemplate;
		}

		/** Download file */
		public DownloadFile(testName: string)
		{
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
	}
}