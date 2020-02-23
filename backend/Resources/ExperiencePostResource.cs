using System.Collections.Generic;
using System;
using OpenData.Resources;

namespace OpenData.Domain.Models
{
	public class ExperiencePostResource
	{
		public Guid Uuid { get; set; }

		public string Title { get; set; }

		public IList<ExperiencePostTagMappingResource> Tags { get; set; }

		public string Contents { get; set; }

		public SafeUserResource LastEditedBy { get; set;}

		public DateTime Created { get; set; }
		public DateTime Modified { get; set; }
	}
}