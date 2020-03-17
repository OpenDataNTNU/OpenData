using System.Collections.Generic;
using System.Threading.Tasks;
using System;

using OpenData.Domain.Models;
using OpenData.Domain.Repositories;
using OpenData.Domain.Services;
using OpenData.Domain.Services.Communication;

namespace OpenData.Services
{
    public class MetadataCategoryService : IMetadataCategoryService
    {
    	private readonly IMetadataCategoryRepository _metadataCategoryRepository;

    	public MetadataCategoryService(IMetadataCategoryRepository metadataCategoryRepository) 
    	{
    		_metadataCategoryRepository = metadataCategoryRepository;
    	}

        public async Task<IEnumerable<MetadataCategory>> ListRootElementsAsync()
        {
        	return await _metadataCategoryRepository.ListRootElementsAsync();
        }

        public async Task<MetadataCategory> GetByUuidAsync(Guid uuid) {
            return await _metadataCategoryRepository.GetByUuidAsync(uuid);
        }

        public async Task<SaveMetadataCategoryResponse> SaveAsync(MetadataCategory category) {
            try
            {
                await _metadataCategoryRepository.AddAsync(category);
                
                return new SaveMetadataCategoryResponse(category);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new SaveMetadataCategoryResponse($"An error occurred when saving the category: {ex.Message}");
            }
        }
    }
}