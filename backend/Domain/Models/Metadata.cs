using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System;

namespace OpenData.Domain.Models
{
	public class Metadata
	{
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public Guid Uuid { get; set; }

		public string FormatName { get; set; }
		public string Url { get; set; }
		public string Description { get; set; }

		public DataFormat Format { get; set; }
		
		public EReleaseState ReleaseState { get; set; }

		public string MunicipalityName { get; set; }
		public Municipality Owner { get; set; }
		
		public string MetadataTypeName { get; set; }
		public MetadataType Type { get; set; }
	}
}