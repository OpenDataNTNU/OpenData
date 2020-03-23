using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System;

namespace OpenData.Domain.Models
{
	public class MetadataType
	{
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public Guid Uuid { get; set; }

		public string Name { get; set; }
		public MetadataTypeDescription Description { get; set; } = null;

		public IList<MetadataTypeTagMapping> Tags { get; set; }
		public IList<MetadataTypeDescription> Descriptions { get; set; }
		public IList<Metadata> MetadataList { get; set; }

		public Guid CategoryUuid { get; set; }
		public MetadataCategory Category { get; set; }
	}
}