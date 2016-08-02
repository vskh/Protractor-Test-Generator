module ExtensionApp.Directives
{
	/**
	 * Options directive
	 */
	export class OptionsDirective
	{
		/**
		 * Instance of the directive.
		 */
		public static Instance(): () => OptionsDirective
		{
			var directive = (): OptionsDirective =>
			{
				return new OptionsDirective();
			}

			//directive.$inject = ['$location', '$routeParams', 'VSOService'];
			return directive;
		}
	}
}