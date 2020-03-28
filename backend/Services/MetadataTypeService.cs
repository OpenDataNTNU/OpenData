using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.Domain.Models;
using OpenData.Domain.Repositories;
using OpenData.Domain.Services;
using OpenData.Domain.Services.Communication;
using System;
using OpenData.Resources;

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

        public async Task<MetadataType> GetByUuidAsync(Guid uuid){
            return await _metadataTypeRepository.GetByUuidAsync(uuid);
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

        public async Task<IEnumerable<MetadataType>> FilterSearchAsync(MetadataTypeSearchParametersResource searchParams)
        {
            return await _metadataTypeRepository.FilterSearchAsync(searchParams);
        }

        public async Task AddNewDescriptionAsync(MetadataTypeDescription metadataTypeDescription)
        {
            await _metadataTypeRepository.AddNewDescriptionAsync(metadataTypeDescription);
        }

        public async Task<IEnumerable<MetadataTypeDescription>> ListDescriptionsAsync(Guid metadataTypeUuid, string userMail)
        {
            return await _metadataTypeRepository.ListDescriptionsAsync(metadataTypeUuid, userMail);
        }

        public async Task VoteOnDescriptionAsync(MetadataTypeDescriptionVote vote, Guid metadataUuid)
        {
            await _metadataTypeRepository.VoteOnDescriptionAsync(vote, metadataUuid);
        }

        public async Task RemoveVoteOnDescriptionAsync(string userMail, Guid descUuid, Guid metadataUuid)
        {
            await _metadataTypeRepository.RemoveVoteOnDescriptionAsync(userMail, descUuid, metadataUuid);
        }
    }
}