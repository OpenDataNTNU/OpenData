using System.Collections.Generic;
using System;

namespace OpenData.Domain.Models
{
	public class MetadataTypeTagMappingResource
	{
		public string TagName { get; set; }

		public Guid MetadataTypeUuid { get; set; }
		
	}
}