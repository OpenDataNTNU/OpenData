using System;
using OpenData.Domain.Models;

namespace OpenData.Resources
{
    /// <summary>
    /// Used for safely transporting userdata without passwords, salts and other classified information.
    /// </summary>
    public class PrivateSafeUserResource
    {
        public string Mail { get; set; }
        public UserType UserType { get; set; }
        public string Token { get; set; }
    }
}
