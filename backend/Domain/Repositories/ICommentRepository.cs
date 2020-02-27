using System.Collections.Generic;
using System.Threading.Tasks;
using System;

using OpenData.Domain.Models;

namespace OpenData.Domain.Repositories
{
    public interface ICommentRepository
    {
        Task AddRootCommentToMetadataAsync(Comment comment);
        Task AddRootCommentToExperiencePostAsync(Comment comment);
        Task ReplyToCommentAsync(Comment comment);
        Task<IEnumerable<Comment>> FetchCommentsForMetadataAsync(Guid uuid);
        Task<IEnumerable<Comment>> FetchCommentsForExperiencePostAsync(Guid uuid);
    }
}