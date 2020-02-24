using System.Collections.Generic;
using System.Threading.Tasks;
using System;

using OpenData.Domain.Models;

namespace OpenData.Domain.Repositories
{
    public interface IMetadataRepository
    {
        Task<IEnumerable<Metadata>> ListAsync();
        Task<Metadata> GetByUuidAsync(Guid uuid);
        Task AddAsync(Metadata metadata);
        Task AddCommentAsync(Comment comment);
        Task<IEnumerable<Comment>> FetchCommentsAsync(string uuid);
    }
}