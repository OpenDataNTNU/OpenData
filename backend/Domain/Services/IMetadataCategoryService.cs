using System.Collections.Generic;
using System.Threading.Tasks;
using System;

using OpenData.Domain.Services.Communication;
using OpenData.Domain.Models;

namespace OpenData.Domain.Services
{
    public interface IMetadataCategoryService
    {
        Task<IEnumerable<MetadataCategory>> ListRootElementsAsync();
        Task<MetadataCategory> GetByUuidAsync(Guid uuid);
        Task<SaveMetadataCategoryResponse> SaveAsync(MetadataCategory category);
    }
}