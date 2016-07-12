module ExtensionApp.Services
{
	/** Template service */
	export class TemplateService
	{
		/** Dependency injection */
		static $inject: string[] = ['chrome', 'ChromeService'];

		private fileName: string;

		InitializeFileName(fileName: string)
		{
			this.fileName = fileName;
			var fileData = this.GetFileTemplate();
			this.DownloadFile(fileName, fileData);
		}

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
		public ComposeFile()
		{
			var fileTemplate = this.GetFileTemplate();
			//fileTemplate.replace('%NAME%', )
			/** File template replacement tags */
			var testName: string = '%NAME%';
			var testTemplate: string = '%TESTTEMPLATE%';

			/*chrome.downloads.download({
				url: "data:text/plain," + formatted,
				filename: "tests.js",
				conflictAction: "uniquify", // or "overwrite" / "prompt"
				saveAs: false, // true gives save-as dialogue
				}, function(downloadId) {
					console.log("Downloaded item with ID", downloadId);
			});*/
		}

		public DownloadFile(fileName: string, fileData: string)
		{
			chrome.downloads.download({
				url: "data:text/plain," + fileData,
				filename: fileName,
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