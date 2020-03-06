using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System;

namespace OpenData.Domain.Models
{
	public class LikeReport
	{
		public int LikeCount { get; set; }
		public bool Liked { get; set; }
	}
}