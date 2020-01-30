using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.Domain.Models;

namespace OpenData.Domain.Repositories
{
    public interface IUsersRepository
    {
        Task<User> Authenticate(string mail, string password);
        Task<IEnumerable<User>> GetAll();
        Task<User> AddNewUserAsync(User user);
    }
}