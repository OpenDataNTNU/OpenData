using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.Domain.Models;

namespace OpenData.Domain.Services
{
    public interface IMunicipalityService
    {
        Task<IEnumerable<Municipality>> ListAsync();
        Task<Municipality> FetchByName(string name);
        Task<Municipality> GetMunicipalityByDomainAsync(string domain);
    }
}