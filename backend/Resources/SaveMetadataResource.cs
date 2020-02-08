using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace OpenData.Domain.Models
{
	///<summary>
	///Represents the required fields for the creation of a metadata object
	///</summary>
	public class SaveMetadataResource
	{
		[Required]
		[MaxLength(2048)]
		public string Url { get; set; }

		[Required]
		public string Description { get; set; }

		[Required]
		public string FormatName { get; set; }

		[Required]
		public EReleaseState ReleaseState { get; set; }

		[Required]
		public string MetadataTypeName { get; set; }

		[Required]
		public string MunicipalityName { get; set; }
	}
}