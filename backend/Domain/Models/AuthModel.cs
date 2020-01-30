using System;
using System.ComponentModel.DataAnnotations;

namespace OpenData.Domain.Models
{
    /// <summary>
    /// Used for loggin user in.
    /// </summary>
    public class AuthModel
    {
        [Required]
        public string Mail { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
