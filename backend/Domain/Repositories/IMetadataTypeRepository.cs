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
         Task AddNewDescriptionAsync(MetadataTypeDescription metadataTypeDescription);
         Task<IEnumerable<MetadataTypeDescription>> ListDescriptionsAsync(Guid metadataTypeUuid);
         Task VoteOnDescriptionAsync(MetadataTypeDescriptionVote vote, Guid metadataUuid);
         Task RemoveVoteOnDescriptionAsync(string userMail, Guid descUuid, Guid metadataUuid);
    }
}