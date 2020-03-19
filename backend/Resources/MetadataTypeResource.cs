using System.Collections.Generic;
using System;

namespace OpenData.Domain.Models
{
	public class MetadataTypeResource
	{
		public Guid Uuid { get; set; }
		
		public string Name { get; set; }
		public IList<MetadataTypeTagMappingResource> Tags { get; set; }
		public string Description { get; set; }
		public IList<MetadataResource> MetadataList { get; set; }

		public Guid CategoryUuid { get; set; }
	}
}