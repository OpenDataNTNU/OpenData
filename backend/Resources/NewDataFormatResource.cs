using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace OpenData.Resources
{
	public class NewDataFormatResource
	{
		[Required]
		public string Name { get; set; }
		[Required]
		public string MimeType { get; set; }
		[Required]
		public string Description { get; set; }
		public string DocumentationUrl { get; set; }
	}
}