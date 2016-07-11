module ExtensionApp.Services
{
	/** Template service */
	export class TemplateService
	{
		/** Dependency injection */
		static $inject: string[] = ['chrome'];

		/**
		 * Constructor
		 * @param chrome extension access
		 */
		constructor(private chrome: any)
		{
		}

		/** Compose file */
		public ComposeFile()
		{
			var fileTemplateUrl: string = chrome.extension.getURL('file_template.js');

			/** File template replacement tags */
			var testName: string = '%NAME%';
			var testTemplate: string = '%TESTTEMPLATE%';
			var fileContent: string = this.readTextFile(fileTemplateUrl);

			var formatted: string = this.formatString(fileContent, "testValue1", "testValue2");
			chrome.downloads.download({
				url: "data:text/plain," + formatted,
				filename: "tests.js",
				conflictAction: "uniquify", // or "overwrite" / "prompt"
				saveAs: false, // true gives save-as dialogue
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