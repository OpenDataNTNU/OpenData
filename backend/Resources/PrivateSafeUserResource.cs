using System;
using OpenData.Domain.Models;

namespace OpenData.Resources
{
    /// <summary>
    /// Used for safely transporting userdata without passwords, salts and other classified information.
    /// The Token is a property here, this should never be sent to someone besides the user whom this data belongs to.
    /// </summary>
    public class PrivateSafeUserResource
    {
        public string Mail { get; set; }
        public UserType UserType { get; set; }
        public string MunicipalityName { get; set; }
        public string Token { get; set; }
    }
}
