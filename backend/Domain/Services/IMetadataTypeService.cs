using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.Domain.Models;
using OpenData.Domain.Services.Communication;
using OpenData.Resources;

namespace OpenData.Domain.Services
{
    public interface IMetadataTypeService
    {
         Task<IEnumerable<MetadataType>> ListAsync();
         Task<MetadataType> GetByNameAsync(string name);
         Task<SaveMetadataTypeResponse> SaveAsync(MetadataType metadata);
         Task<IEnumerable<MetadataType>> FilterSearchAsync(MetadataTypeSearchParametersResource searchParams);
    }
}