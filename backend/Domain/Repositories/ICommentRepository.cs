using System.Collections.Generic;
using System.Threading.Tasks;
using System;

using OpenData.Domain.Models;

namespace OpenData.Domain.Repositories
{
    public interface ICommentRepository
    {
        Task AddRootCommentToMetadataAsync(Guid metadataUiid, Comment comment);
        Task AddRootCommentToExperiencePostAsync(Guid experiencePostUiid, Comment comment);
        Task ReplyToCommentAsync(Comment comment);
        Task<IEnumerable<Comment>> FetchCommentsForMetadataAsync(Guid metadataUuid);
        Task<IEnumerable<Comment>> FetchCommentsForExperiencePostAsync(Guid experiencePostUuid);
        Task<IEnumerable<Comment>> FetchChildComments(Guid commentUuid);
    }
}