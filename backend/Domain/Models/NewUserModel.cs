using System;
using System.ComponentModel.DataAnnotations;

namespace OpenData.Domain.Models
{
    public class NewUserModel
    {
        [Required]
        public string Mail { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
