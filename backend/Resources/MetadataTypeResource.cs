using System.Collections.Generic;
using System;

using OpenData.Domain.Models;

namespace OpenData.Resources
{
	public class MetadataTypeResource
	{
		public Guid Uuid { get; set; }
		
		public string Name { get; set; }
		public IList<MetadataTypeTagMappingResource> Tags { get; set; }
		public MetadataTypeDescriptionResource Description { get; set; }
		public IList<MetadataResource> MetadataList { get; set; }

		public Guid CategoryUuid { get; set; }
	}
}