module ExtensionApp.Controllers
{
	/** Save controller */
	export class SaveController
	{
		/** Test name */
		testName: string;

		/** Dependency injection */
		static $inject = ['TemplateService'];

		/**
		 * Constructor for save controller
		 * @param TemplateService Template Service for accessing templates and saving files.
		 */
		constructor(private TemplateService: Services.TemplateService)
		{
		}

		/**
		 * Download the test file
		 */
		Download()
		{
			this.TemplateService.DownloadFile(this.testName && this.testName.length > 0 ? this.testName : 'Recorded Test');
		}
	}
}