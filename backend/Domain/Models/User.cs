using System.Collections.Generic;
using System.ComponentModel;

namespace OpenData.Domain.Models
{
    public enum UserType: byte
    {
        [Description("standard")]
        Standard,
        [Description("admin")]
        Admin
    }

    public class User
	{
		public string Mail { get; set; }
		public string Password { get; set; }
		public string PasswordSalt { get; set; }
        public UserType UserType { get; set; } = UserType.Standard;
        public string Token { get; set; }
	}
}