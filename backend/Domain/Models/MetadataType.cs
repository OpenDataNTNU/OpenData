using System.Collections.Generic;

namespace OpenData.Domain.Models
{
	public class MetadataType
	{
		public string Name { get; set; }
		public IList<MetadataTypeTagMapping> Tags { get; set; }
		public string Description { get; set; }
		public IList<Metadata> MetadataList { get; set; }
	}
}