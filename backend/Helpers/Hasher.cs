using System;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace OpenData.Helpers
{
    public static class Hasher
    {
        public static string GenerateSalt()
        {
            byte[] saltBytes = new byte[16]; // Is 128 bit salt
            using (var randomNumGen = RandomNumberGenerator.Create())
            {
                randomNumGen.GetBytes(saltBytes);
            }

            return Convert.ToBase64String(saltBytes);
        }

        public static string HashPassword(string password, string salt)
        {
            var hasher = new SHA256Managed();
            hasher.ComputeHash(Convert.FromBase64String(password + salt));
        }
    }
}
