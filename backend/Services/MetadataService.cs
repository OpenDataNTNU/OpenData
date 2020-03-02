using System.Collections.Generic;
using System.Threading.Tasks;
using System;

using OpenData.Domain.Models;
using OpenData.Domain.Repositories;
using OpenData.Domain.Services;
using OpenData.Domain.Services.Communication;

namespace OpenData.Services
{
    public class MetadataService : IMetadataService
    {
    	private readonly IMetadataRepository _metadataRepository;

    	public MetadataService(IMetadataRepository metadataRepository) 
    	{
    		_metadataRepository = metadataRepository;
    	}

        public async Task<IEnumerable<Metadata>> ListAsync()
        {
        	return await _metadataRepository.ListAsync();
        }

        public async Task<Metadata> GetByUuidAsync(Guid uuid) {
            return await _metadataRepository.GetByUuidAsync(uuid);
        }

        public async Task<SaveMetadataResponse> SaveAsync(Metadata metadata) {
            try
            {
                await _metadataRepository.AddAsync(metadata);
                
                return new SaveMetadataResponse(metadata);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new SaveMetadataResponse($"An error occurred when saving the category: {ex.Message}");
            }
        }
    }
}