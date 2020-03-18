using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System;

namespace OpenData.Resources
{
	///<summary>
	///Represents the required fields for the creation of a metadata object
	///</summary>
	public class SaveMetadataCategoryResource
	{
		[MaxLength(128)]
		public string Name { get; set; }

		public Guid? ParentUuid { get; set; }
	}
}