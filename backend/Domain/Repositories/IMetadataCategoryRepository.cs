using System.Collections.Generic;
using System.Threading.Tasks;
using System;

using OpenData.Domain.Models;

namespace OpenData.Domain.Repositories
{
    public interface IMetadataCategoryRepository
    {
        Task<IEnumerable<MetadataCategory>> ListRootElementsAsync();
        Task<MetadataCategory> GetByUuidAsync(Guid uuid);
        Task AddAsync(MetadataCategory category);
    }
}