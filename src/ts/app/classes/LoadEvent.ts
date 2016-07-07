module ExtensionApp.Controllers
{
	/** Load event */
	export class LoadEvent extends Event
	{
		/** Type is load */
		public type: EventType = EventType.Load;

		/** Constructor */
		constructor(private loadUrl: string)
		{
			super();
		}
	}
}
