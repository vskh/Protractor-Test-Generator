module ExtensionApp.Controllers
{
	/** Save controller */
	export class SaveController
	{
		/** File name */
		fileName: string;

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
		 * Set file name and try downloading
		 */
		SetFileName()
		{
			if (this.fileName && this.fileName.length > 0)
			{
				this.TemplateService.InitializeFileName(this.fileName);
				return;
			}
		}

		/** 
		 * Download the test file
		 */
		DownloadTestFile()
		{

		}
	}
}