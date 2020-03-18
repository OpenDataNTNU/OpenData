using System.Collections.Generic;
using System;
using OpenData.Resources;

using OpenData.Resources;

namespace OpenData.Domain.Models
{
	public class MetadataResource
	{
		public Guid Uuid { get; set; }

		public string Description { get; set; }

		public EReleaseState ReleaseState { get; set; }

		public string MetadataTypeName { get; set; }

		public string MunicipalityName { get; set; }

		public IList<DataSourceResource> DataSource { get; set; }
    
		public IList<MetadataExperiencePostMappingResource> ExperiencePosts { get; set; }
	}
}