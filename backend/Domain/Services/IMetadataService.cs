using System.Collections.Generic;
using System.Threading.Tasks;
using System;

using OpenData.Domain.Services.Communication;
using OpenData.Domain.Models;

namespace OpenData.Domain.Services
{
    public interface IMetadataService
    {
        Task<IEnumerable<Metadata>> ListAsync();
        Task<Metadata> GetByUuidAsync(Guid uuid);
        Task<SaveMetadataResponse> SaveAsync(Metadata metadata);
        Task<Comment> AddCommentAsync(Comment comment);
        Task<IEnumerable<Comment>> FetchCommentsAsync(Guid uuid);
    }
}