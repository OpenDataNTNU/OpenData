using System;
using System.ComponentModel.DataAnnotations;

namespace OpenData.Resources
{
    /// <summary>
    /// Form for creating new user
    /// </summary>
    public class NewUserResource
    {
        [Required]
        public string Mail { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
