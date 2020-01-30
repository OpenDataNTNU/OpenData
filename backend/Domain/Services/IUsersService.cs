using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.Domain.Models;

namespace OpenData.Domain.Services
{
    public interface IUsersService
    {
        Task<User> AuthenticateAsync(string mail, string password);
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> AddNewUserAsync(User user);
    }
}