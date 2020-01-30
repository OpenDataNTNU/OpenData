using System;
using System.ComponentModel.DataAnnotations;

namespace OpenData.Domain.Models
{
    public class AuthModel
    {
        [Required]
        public string Mail { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
