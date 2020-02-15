using System;
using System.ComponentModel.DataAnnotations;
using OpenData.Domain.Models;

namespace OpenData.Resources
{
    /// <summary>
    /// Form for creating new user should never be sent from the server.
    /// But exclusively used for creating a new user. 
    /// </summary>
    public class NewUserResource
    {
        [Required]
        public string Mail { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public UserType UserType { get; set; }
    }
}
