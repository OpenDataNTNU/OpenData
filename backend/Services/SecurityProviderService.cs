using System;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.Domain.Models;
using OpenData.Domain.Repositories;
using OpenData.Domain.Services;

namespace OpenData.Services
{
    public class SecurityService : ISecurityService
    {

        public SecurityService()
        {

        }

        public string GenerateSalt()
        {
            byte[] saltBytes = new byte[16]; // Is 128 bit salt
            using (var randomNumGen = RandomNumberGenerator.Create())
            {
                randomNumGen.GetBytes(saltBytes);
            }

            return Convert.ToBase64String(saltBytes);
        }

        public string HashPassword(string password, string salt)
        {
            SHA256Managed hasher = new SHA256Managed();
            byte[] passWithSaltBytes = Encoding.ASCII.GetBytes(password + salt);
            byte[] hashedBytes = hasher.ComputeHash(passWithSaltBytes);
            return Convert.ToBase64String(hashedBytes);
        }
    }
}