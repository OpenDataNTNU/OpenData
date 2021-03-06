using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.Domain.Models;
using OpenData.Resources;

namespace OpenData.Domain.Repositories
{
    public interface IUserRepository
    {
        Task<User> Authenticate(string mail, string password);
        Task<IEnumerable<User>> GetAll();
        Task<User> AddNewUserAsync(User user);
        Task<User> GetUserByMailAsync(string mail);
    }
}