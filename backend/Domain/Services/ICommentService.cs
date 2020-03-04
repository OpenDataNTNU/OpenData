using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.Domain.Models;

namespace OpenData.Domain.Services
{
    public interface ICommentService
    {
        Task AddRootCommentToMetadataAsync(Guid metadataUiid, Comment comment);
        Task AddRootCommentToExperiencePostAsync(Guid experiencePostUiid, Comment comment);
        Task ReplyToCommentAsync(Comment comment);
        Task<IEnumerable<Comment>> FetchCommentsForMetadataAsync(Guid metadataUuid);
        Task<IEnumerable<Comment>> FetchCommentsForExperiencePostAsync(Guid experiencePostUuid);
        Task<IEnumerable<Comment>> FetchChildComments(Guid commentUuid);
    }
}
