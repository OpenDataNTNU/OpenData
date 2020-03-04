using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.Domain.Models;

namespace OpenData.Domain.Repositories
{
    public interface IMetadataTypeRepository
    {
         Task<IEnumerable<MetadataType>> ListAsync();
         Task<MetadataType> GetByNameAsync(string name);
         Task AddAsync(MetadataType metadata);
         Task<IEnumerable<MetadataType>> ListNamesAsync();
    }
}