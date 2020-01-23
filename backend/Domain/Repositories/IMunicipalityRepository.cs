using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.Domain.Models;

namespace OpenData.Domain.Repositories
{
    public interface IMunicipalityRepository
    {
         Task<IEnumerable<Municipality>> ListAsync();
    }
}