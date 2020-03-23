using System.Collections.Generic;
using System.Threading.Tasks;
using System;

using OpenData.Domain.Models;
using OpenData.Resources;

namespace OpenData.Domain.Repositories
{
    public interface IMetadataTypeRepository
    {
         Task<IEnumerable<MetadataType>> ListAsync();
         Task<MetadataType> GetByUuidAsync(Guid uuid);
         Task AddAsync(MetadataType metadata);
         Task<IEnumerable<MetadataType>> FilterSearchAsync(MetadataTypeSearchParametersResource searchParams);
    }
}