using System.Collections.Generic;
using System;

namespace OpenData.Domain.Models
{
	public class ExperiencePostTagMappingResource
	{
		public string TagName { get; set; }

		public Guid ExperiencePostGuid { get; set; }
	}
}