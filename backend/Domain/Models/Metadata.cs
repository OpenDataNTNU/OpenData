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

		public string Description { get; set; }

		public EReleaseState ReleaseState { get; set; }

		public string MunicipalityName { get; set; }
		public Municipality Owner { get; set; }
		
		public Guid MetadataTypeUuid { get; set; }
		public MetadataType Type { get; set; }

		public IList<DataSource> DataSource { get; set; }

		public IList<Like> Likes { get; set; }

		public IList<MetadataCommentMapping> Comments { get; set; }

		public IList<MetadataExperiencePostMapping> ExperiencePosts { get; set; }
	}
}