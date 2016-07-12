module ExtensionApp.Controllers
{
	/** Save controller */
	export class SaveController
	{
		/** Dependency injection */
		static $inject = ['TemplateService'];

		/**
		 * Constructor for save controller
		 * @param TemplateService Template Service for accessing templates and saving files.
		 */
		constructor(private TemplateService: Services.TemplateService)
		{
		}

		/**  */
		DownloadTestFile()
		{

		}
	}
}