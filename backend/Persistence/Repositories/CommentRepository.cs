﻿using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OpenData.Domain.Models;
using OpenData.Domain.Repositories;
using OpenData.Persistence.Contexts;
using System.Web;
using System;
using System.Linq;

namespace OpenData.Persistence.Repositories
{
    public class CommentRepository : BaseRepository, ICommentRepository
    {
        public CommentRepository(AppDbContext context) : base(context) { }


        private async Task<Comment> AddRootComment(Comment comment)
        {
            await _context.Comments.AddAsync(comment);
            return await _context.Comments.SingleOrDefaultAsync(c => c.Uuid == comment.Uuid);
        }

        public async Task AddRootCommentToExperiencePostAsync(Guid experiencePostUiid, Comment comment)
        {
            await AddRootComment(comment);

            var experiencePostCommentMapping = new ExperiencePostCommentMapping();
            experiencePostCommentMapping.CommentUuid = comment.Uuid;
            experiencePostCommentMapping.ExperiencePostUuid = experiencePostUiid;
            await _context.ExperiencePostCommentMappings.AddAsync(experiencePostCommentMapping);

            await _context.SaveChangesAsync();
        }

        public async Task AddRootCommentToMetadataAsync(Guid metadataUiid, Comment comment)
        {
            await AddRootComment(comment);

            var metadataCommentMapping = new MetadataCommentMapping();
            metadataCommentMapping.CommentUuid = comment.Uuid;
            metadataCommentMapping.MetadataUuid = metadataUiid;
            await _context.MetadataCommentMappings.AddAsync(metadataCommentMapping);

            await _context.SaveChangesAsync();
        }

        public async Task ReplyToCommentAsync(Comment comment)
        {
            await AddRootComment(comment);

            Comment parentComment = _context.Comments.SingleOrDefault(c => c.Uuid == comment.ParentCommentUuid);
            if(parentComment == null)
                throw new InvalidOperationException("Illegal parent comment for reply.");
            
            parentComment.HasChildren = true;

            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Comment>> FetchCommentsForExperiencePostAsync(Guid experiencePostUuid)
        {
            return await _context
                .ExperiencePostCommentMappings
                .Include(m => m.Comment)
                .ThenInclude(c => c.ChildComments)
                .ThenInclude(c => c.ChildComments)
                .ThenInclude(c => c.ChildComments)
                .ThenInclude(c => c.ChildComments)
                .Where(m => m.ExperiencePostUuid == experiencePostUuid)
                .Select((m) => m.Comment)
                .ToListAsync();
        }

        public async Task<IEnumerable<Comment>> FetchCommentsForMetadataAsync(Guid metadataUuid)
        {
            return await _context
                .MetadataCommentMappings
                .Include(m => m.Comment)
                .ThenInclude(c => c.ChildComments)
                .ThenInclude(c => c.ChildComments)
                .ThenInclude(c => c.ChildComments)
                .ThenInclude(c => c.ChildComments)
                .Where(m => m.MetadataUuid == metadataUuid)
                .Select((m) => m.Comment)
                .ToListAsync();
        }

        public async Task<IEnumerable<Comment>> FetchChildComments(Guid commentUuid)
        {
            return await _context
                .Comments
                .Include(c => c.ChildComments)
                .ThenInclude(c => c.ChildComments)
                .ThenInclude(c => c.ChildComments)
                .ThenInclude(c => c.ChildComments)
                .ThenInclude(c => c.ChildComments)
                .Where(c => c.Uuid == commentUuid)
                .ToListAsync();
        }
    }
}