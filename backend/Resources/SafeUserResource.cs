using System;
using OpenData.Domain.Models;

namespace OpenData.Resources
{
    /// <summary>
    /// Used for safely transporting userdata without passwords, salts and other classified information.
    /// </summary>
    public class SafeUserResource
    {
        public string Mail { get; set; }
        public UserType UserType { get; set; }
    }
}
