using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System;

namespace OpenData.Domain.Models
{
	public class ExperiencePost
	{
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public Guid Uuid { get; set; }

		public string Contents { get; set; }

		public User LastEditedBy { get; set;}

		[DatabaseGenerated(DatabaseGeneratedOption.Computed)]
		public DateTime Created { get; set; }
		[DatabaseGenerated(DatabaseGeneratedOption.Computed)]
		public DateTime Modified { get; set; }
	}
}