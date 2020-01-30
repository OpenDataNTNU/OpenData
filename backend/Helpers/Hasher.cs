using System;
using System.Security.Cryptography;
using System.Text;
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
            SHA256Managed hasher = new SHA256Managed();
            byte[] passWithSaltBytes = Encoding.ASCII.GetBytes(password + salt);
            byte[] hashedBytes = hasher.ComputeHash(passWithSaltBytes);
            return Convert.ToBase64String(hashedBytes);
        }
    }
}
