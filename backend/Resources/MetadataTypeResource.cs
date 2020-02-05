using System.Collections.Generic;

namespace OpenData.Domain.Models
{
	public class MetadataTypeResource
	{
		public string Name { get; set; }
		public IList<MetadataTypeTagMappingResource> Tags { get; set; }
		public string Description { get; set; }
		public IList<MetadataResource> MetadataList { get; set; }
	}
}