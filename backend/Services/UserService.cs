using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.Domain.Models;
using OpenData.Domain.Services;
using OpenData.Domain.Repositories;


namespace OpenData.Services
{
    public class UserService : IUsersService
    {
        private readonly IUsersRepository usersRepository;

        public UserService(IUsersRepository usersRepository)
        {
            this.usersRepository = usersRepository;
        }

        public async Task<User> AuthenticateAsync(string mail, string password)
        {
            return await usersRepository.Authenticate(mail, password);
        }

        public async Task<User> AddNewUserAsync(User user)
        {
            return await usersRepository.AddNewUserAsync(user);
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await usersRepository.GetAll();
        }
    }
}
