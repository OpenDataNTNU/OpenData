using System.Collections.Generic;
using System;

namespace OpenData.Domain.Models
{
	public class MetadataTypeTagMapping
	{
		public string TagName { get; set; }

		public Tag Tag { get; set; }

		public Guid MetadataTypeUuid { get; set; }
		
		public MetadataType Type { get; set; }
	}
}