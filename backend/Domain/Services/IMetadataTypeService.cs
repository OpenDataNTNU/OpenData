using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.Domain.Models;

namespace OpenData.Domain.Services
{
    public interface IMetadataTypeService
    {
         Task<IEnumerable<MetadataType>> ListAsync();
         Task<MetadataType> GetByNameAsync(string name);
    }
}