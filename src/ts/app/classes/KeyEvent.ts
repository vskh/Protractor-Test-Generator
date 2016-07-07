module ExtensionApp.Controllers
{
	/** Load event */
	export class KeyEvent extends Event
	{
		/** Type is load */
		public type: EventType = EventType.Key;

		/** Constructor */
		constructor(private loadUrl: string)
		{
			super();
		}
	}
}
