module ExtensionApp.Controllers
{
	/** Click event */
	export class ClickEvent extends Event
	{
		/** Click event type */
		public type: EventType = EventType.Click;

		/** Make sure the event class + id + perhaps the element number is logged */
		constructor(private elementId: string, private elementClass: string)
		{
			super();
		}
	}
}