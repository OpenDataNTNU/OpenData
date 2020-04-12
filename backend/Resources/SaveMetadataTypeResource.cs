using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System;

namespace OpenData.Domain.Models
{
	public class SaveMetadataTypeResource
	{
		[Required]
		public string Name { get; set; }
		
		[Required]
		public string Description { get; set; }

		[Required]
		public Guid CategoryUuid { get; set; }
	}
}