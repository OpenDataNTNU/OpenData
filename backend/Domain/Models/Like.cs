using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System;

namespace OpenData.Domain.Models
{
	public class Like
	{
		public User LikeUser { get; set;}
		public string LikeUserEmail { get; set;}

		public Metadata Metadata { get; set;}
		public Guid MetadataUuid { get; set; }
	}
}