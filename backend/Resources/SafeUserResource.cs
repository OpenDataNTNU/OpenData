using System;
using OpenData.Domain.Models;

namespace OpenData.Resources
{
    /// <summary>
    /// Used for safely transporting userdata without passwords, salts and other classified information.
    /// SafeUser does not include tokens, meaning it is good for sending a lot of user data to for example a admin panel.
    /// </summary>
    public class SafeUserResource
    {
        public string Mail { get; set; }
        public UserType UserType { get; set; }
        public string MunicipalityName { get; set; }
    }
}
