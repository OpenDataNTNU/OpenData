using System.Collections.Generic;

namespace OpenData.Domain.Models
{
	public class Municipality
	{
		public string Name { get; set; }
		public string ShieldFileName { get; set; }
		public float Latitude { get; set; }
		public float Longitude { get; set; }
		public IList<Metadata> MetadataList { get; set; }
	}
}