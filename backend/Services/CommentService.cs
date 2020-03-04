using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.Domain.Models;
using OpenData.Domain.Repositories;
using OpenData.Domain.Services;

namespace OpenData.Services
{
    public class CommentService : ICommentService
    {
        private readonly ICommentRepository commentRepository;

        public CommentService(ICommentRepository commentRepository)
        {
            this.commentRepository = commentRepository;
        }

        public async Task AddRootCommentToExperiencePostAsync(Guid experiencePostUiid, Comment comment)
        {
            await commentRepository.AddRootCommentToExperiencePostAsync(experiencePostUiid, comment);
        }

        public async Task AddRootCommentToMetadataAsync(Guid metadataUiid, Comment comment)
        {
            await commentRepository.AddRootCommentToMetadataAsync(metadataUiid, comment);
        }

        public async Task<IEnumerable<Comment>> FetchChildComments(Guid commentUuid)
        {
            return await commentRepository.FetchChildComments(commentUuid);
        }

        public async Task<IEnumerable<Comment>> FetchCommentsForExperiencePostAsync(Guid experiencePostGuid)
        {
            return await commentRepository.FetchCommentsForExperiencePostAsync(experiencePostGuid);
        }

        public async Task<IEnumerable<Comment>> FetchCommentsForMetadataAsync(Guid metadataGuid)
        {
            return await commentRepository.FetchCommentsForMetadataAsync(metadataGuid);
        }

        public async Task ReplyToCommentAsync(Comment comment)
        {
            await commentRepository.ReplyToCommentAsync(comment);
        }
    }
}
