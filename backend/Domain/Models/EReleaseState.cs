using System.ComponentModel;

namespace OpenData.Domain.Models
{
	public enum EReleaseState: byte
	{
		[Description("The data is open")]
		Released = 1,

		[Description("Ready for release")]
		Green = 2,

		[Description("Needs work")]
		Yellow = 3,

		[Description("Not possible to release")]
		Red = 4,
	}
}