using System;
using OpenData.Domain.Models;

namespace OpenData.Resources
{
    public class SafeUserResource
    {
        public string Mail { get; set; }
        public UserType UserType { get; set; }
    }
}
