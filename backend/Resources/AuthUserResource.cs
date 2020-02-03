using System;
using System.ComponentModel.DataAnnotations;

namespace OpenData.Resources
{
    /// <summary>
    /// Used for loggin user in.
    /// </summary>
    public class AuthUserResource
    {
        [Required]
        public string Mail { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
