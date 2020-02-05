using System.Collections.Generic;
using System;

namespace OpenData.Domain.Models
{
	public class MetadataResource
	{
		public Guid Uuid { get; set; }

		public string Url { get; set; }
		public string Description { get; set; }
		public string FormatName { get; set; }

		public EReleaseState ReleaseState { get; set; }

		public string MetadataTypeName { get; set; }

		public string MunicipalityName { get; set; }
	}
}