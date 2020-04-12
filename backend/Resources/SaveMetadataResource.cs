using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System;

namespace OpenData.Domain.Models
{
	///<summary>
	///Represents the required fields for the creation of a metadata object
	///</summary>
	public class SaveMetadataResource
	{
		[Required]
		public string Description { get; set; }

		[Required]
		public EReleaseState ReleaseState { get; set; }

		[Required]
		public Guid MetadataTypeUuid { get; set; }

		[Required]
		public string MunicipalityName { get; set; }
	}
}