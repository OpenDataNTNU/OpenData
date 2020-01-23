using System.Collections.Generic;

namespace OpenData.API.Domain.Models
{
	public class Municipality
	{
		public string Name { get; set; }
		public string ShieldName { get; set; }
		public float Latitude { get; set; }
		public float Longitude { get; set; }
	}
}