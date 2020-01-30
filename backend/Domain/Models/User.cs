using System.Collections.Generic;
using System.ComponentModel;

namespace OpenData.Domain.Models
{
    public enum UserType
    {
        [Description("none")]
        None,
        [Description("admin")]
        Admin
    }

    public class User
	{
		public string Mail { get; set; }
		public string Password { get; set; }
		public string PasswordSalt { get; set; }
		public UserType UserType { get; set; }
        public string Token { get; set; }
	}
}