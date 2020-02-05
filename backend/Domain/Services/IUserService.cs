using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.Domain.Models;

namespace OpenData.Domain.Services
{
    public interface IUserService
    {
        Task<User> AuthenticateAsync(string mail, string password);
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> AddNewUserAsync(User user);
    }
}