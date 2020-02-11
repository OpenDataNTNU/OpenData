using System.Collections.Generic;
using System;

namespace OpenData.Domain.Models
{
	public class ExperiencePostResource
	{
		public Guid Uuid { get; set; }

		public string Contents { get; set; }

		public User LastEditedBy { get; set;}

		public DateTime Created { get; set; }
		public DateTime Modified { get; set; }
	}
}