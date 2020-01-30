using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.Domain.Models;
using OpenData.Domain.Services;


namespace OpenData.Services
{
    public class UserService : IUsersService
    {
        public User AuthenticateAsync(string mail, string password)
        {
            return null;
        }
    }
}
