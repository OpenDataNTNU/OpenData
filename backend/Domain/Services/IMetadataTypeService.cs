using System.Collections.Generic;
using System.Threading.Tasks;
using System;

using OpenData.Domain.Models;
using OpenData.Domain.Services.Communication;
using OpenData.Resources;

namespace OpenData.Domain.Services
{
    public interface IMetadataTypeService
    {
         Task<IEnumerable<MetadataType>> ListAsync();
         Task<MetadataType> GetByUuidAsync(Guid uuid);
         Task<SaveMetadataTypeResponse> SaveAsync(MetadataType metadata);
         Task<IEnumerable<MetadataType>> FilterSearchAsync(MetadataTypeSearchParametersResource searchParams);
         Task AddNewDescriptionAsync(MetadataTypeDescription metadataTypeDescription);
         Task<IEnumerable<MetadataTypeDescription>> ListDescriptionsAsync(Guid metadataTypeUuid, string userMail);
         Task VoteOnDescriptionAsync(MetadataTypeDescriptionVote vote, Guid metadataUuid);
         Task RemoveVoteOnDescriptionAsync(string userMail, Guid descUuid, Guid metadataUuid);
    }
}