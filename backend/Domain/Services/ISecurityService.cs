using System;

namespace OpenData.Domain.Services
{
    public interface ISecurityService
    {
        public string GenerateSalt();

        public string HashPassword(string password, string salt);
    }
}
