using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using OpenData.Domain.Models;
using System;

namespace OpenData.Resources
{
	public class LikeResource
	{
		public string LikeUserEmail { get; set;}

		public Metadata Metadata { get; set;}
	}
}