using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.Domain.Models;
using OpenData.Resources;

namespace OpenData.Domain.Services
{
    public interface IUserService
    {
        Task<User> AuthenticateAsync(string mail, string password);
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> AddNewUserAsync(User user);
        Task<User> GetUserByMailAsync(string mail);
    }
}