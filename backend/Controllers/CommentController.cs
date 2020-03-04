using System;
using System.Net;
using System.Threading.Tasks;
using System.Collections.Generic;

using AutoMapper;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Http;

using OpenData.Domain.Services;
using OpenData.Resources;
using OpenData.Domain.Models;

namespace OpenData.Controllers
{
    [Authorize]
    [Route("/api/[controller]")]
    public class CommentController : Controller
    {
        private readonly ICommentService commentService;
        private readonly IHttpContextAccessor httpContextRetriever;
        private readonly IMapper mapper;

        public CommentController(ICommentService commentService, IHttpContextAccessor httpContextRetriever, IMapper mapper)
        {
            this.commentService = commentService;
            this.httpContextRetriever = httpContextRetriever;
            this.mapper = mapper;
        }

        /// <summary>
        /// Used to PUT comments related to a given Metadata.
        /// </summary>
        /// <param name="metadataUuid"></param>
        /// <param name="newComment">New comment to be added.</param>
        /// <returns>The comment if it was added successfully</returns>
        [HttpPut("metadata/{metadataUuid}")]
        public async Task<IActionResult> PutCommentForMetadataAsync(Guid metadataUuid, [FromBody] NewCommentResource newComment)
        {
            Comment comment = mapper.Map<NewCommentResource, Comment>(newComment);
            comment.UserMail = httpContextRetriever.HttpContext.User.Identity.Name;

            await commentService.AddRootCommentToMetadataAsync(metadataUuid, comment);
            CommentResource retComment = mapper.Map<Comment, CommentResource>(comment);
            return Ok(retComment);
        }

        /// <summary>
        /// Fethes all the comments by a given metadata GUID.
        /// </summary>
        /// <param name="uuid"></param>
        /// <returns>All of the comments for a given metadata GUID</returns>
        [AllowAnonymous]
        [HttpGet("metadata/{metadataUuid}")]
        public async Task<IActionResult> GetCommentsForMetadataAsync(Guid metadataUuid)
        {
            IEnumerable<Comment> comments = await commentService.FetchCommentsForMetadataAsync(metadataUuid);
            var retComments = mapper.Map<IEnumerable<Comment>, IEnumerable<CommentResource>>(comments);
            return Ok(retComments);
        }

        /// <summary>
        /// Used to PUT comments related to a given experience post.
        /// </summary>
        /// <param name="experiencePostUuid"></param>
        /// <param name="newComment">New comment to be added.</param>
        /// <returns>The comment if it was added successfully</returns>
        [HttpPut("experiencepost/{experiencePostUuid}")]
        public async Task<IActionResult> PutCommentForExperiencePostAsync(Guid experiencePostUuid, [FromBody] NewCommentResource newComment)
        {
            Comment comment = mapper.Map<NewCommentResource, Comment>(newComment);
            comment.UserMail = httpContextRetriever.HttpContext.User.Identity.Name;

            await commentService.AddRootCommentToExperiencePostAsync(experiencePostUuid, comment);
            CommentResource retComment = mapper.Map<Comment, CommentResource>(comment);
            return Ok(retComment);
        }

        /// <summary>
        /// Fethes all the comments by a given experience post GUID.
        /// </summary>
        /// <param name="uuid"></param>
        /// <returns>All of the comments for a given experience post GUID</returns>
        [AllowAnonymous]
        [HttpGet("experiencepost/{experiencePostUuid}")]
        public async Task<IActionResult> GetCommentsForExperiencePostAsync(Guid experiencePostUuid)
        {
            IEnumerable<Comment> comments = await commentService.FetchCommentsForExperiencePostAsync(experiencePostUuid);
            var retComments = mapper.Map<IEnumerable<Comment>, IEnumerable<CommentResource>>(comments);
            return Ok(retComments);
        }

        /// <summary>
        /// Used to PUT comments related to a given comment.
        /// </summary>
        /// <param name="commentUuid">CommentUuid for the parent comment</param>
        /// <param name="newComment">New comment to be added.</param>
        /// <returns>The comment if it was added successfully</returns>
        [HttpPut("reply/{commentUuid}")]
        public async Task<IActionResult> ReplyToCommentAsync(Guid commentUuid, [FromBody] NewCommentResource newComment)
        {
            if(commentUuid == null)
                return BadRequest("Invalid comment UUID");

            Comment comment = mapper.Map<NewCommentResource, Comment>(newComment);
            comment.UserMail = httpContextRetriever.HttpContext.User.Identity.Name;
            comment.ParentCommentUuid = commentUuid;

            await commentService.ReplyToCommentAsync(comment);
            CommentResource retComment = mapper.Map<Comment, CommentResource>(comment);
            return Ok(retComment);
        }

        /// <summary>
        /// Used to GET child comments related to a given comment.
        /// </summary>
        /// <param name="commentUuid">CommentUuid for the parent comment</param>
        /// <returns>The child comments for a given comment, and 5 levels depth (not including the comment itself)</returns>
        [HttpGet("childcomments/{commentUuid}")]
        public async Task<IActionResult> FetchChildComments(Guid commentUuid)
        {
            if (commentUuid == null)
                return BadRequest("Invalid comment UUID");
            
            IEnumerable<Comment> comments = await commentService.FetchChildComments(commentUuid);
            var retComments = mapper.Map<IEnumerable<Comment>, IEnumerable<CommentResource>>(comments);
            return Ok(retComments);
        }
    }
}
