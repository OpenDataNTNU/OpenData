using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.Domain.Models;

namespace OpenData.Domain.Services
{
    public interface ICommentService
    {
        Task AddRootCommentToMetadataAsync(Guid MetadataUiid, Comment comment);
        Task AddRootCommentToExperiencePostAsync(Guid ExperiencePostUiid, Comment comment);
        Task ReplyToCommentAsync(Comment comment);
        Task<IEnumerable<Comment>> FetchCommentsForMetadataAsync(Guid metadataGuid);
        Task<IEnumerable<Comment>> FetchCommentsForExperiencePostAsync(Guid experiencePostGuid);
    }
}
