using System.Collections.Generic;
using System;

namespace OpenData.Domain.Models
{
	public class ExperiencePostTagMapping
	{
		public string TagName { get; set; }

		public Tag Tag { get; set; }

		public Guid ExperiencePostUuid { get; set; }

		public ExperiencePost Post { get; set; }
	}
}