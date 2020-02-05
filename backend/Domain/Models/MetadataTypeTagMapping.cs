using System.Collections.Generic;

namespace OpenData.Domain.Models
{
	public class MetadataTypeTagMapping
	{
		public string TagName { get; set; }

		public Tag Tag { get; set; }

		public string MetadataTypeName { get; set; }
		
		public MetadataType Type { get; set; }
	}
}