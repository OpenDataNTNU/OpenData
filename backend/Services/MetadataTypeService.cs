using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.Domain.Models;
using OpenData.Domain.Repositories;
using OpenData.Domain.Services;
using OpenData.Domain.Services.Communication;
using System;

namespace OpenData.Services
{
    public class MetadataTypeService : IMetadataTypeService
    {
    	private readonly IMetadataTypeRepository _metadataTypeRepository;

    	public MetadataTypeService(IMetadataTypeRepository metadataTypeRepository) 
    	{
    		_metadataTypeRepository = metadataTypeRepository;
    	}

        public async Task<IEnumerable<MetadataType>> ListAsync()
        {
        	return await _metadataTypeRepository.ListAsync();
        }

        public async Task<MetadataType> GetByNameAsync(string name) {
            return await _metadataTypeRepository.GetByNameAsync(name);
        }

        public async Task<SaveMetadataTypeResponse> SaveAsync(MetadataType metadata) {
            try
            {
                await _metadataTypeRepository.AddAsync(metadata);
                
                return new SaveMetadataTypeResponse(metadata);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new SaveMetadataTypeResponse($"An error occurred when saving the metadata type: {ex.Message}");
            }
        }

        public async Task<MetadataType> ListNamesAsync(string name)
        {
            return await _metadataTypeRepository.ListNamesAsync(name);
        }

        public async Task<IEnumerable<IList<MetadataTypeTagMapping>>> ListTagsAsync()
        {
            return await _metadataTypeRepository.ListTagsAsync();
        }
    }
}