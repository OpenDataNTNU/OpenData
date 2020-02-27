using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using AutoMapper;
using OpenData.Domain.Models;
using OpenData.Domain.Services;
using OpenData.Domain.Repositories;
using OpenData.Resources;
using OpenData.Services;
using OpenData.Extensions;
using OpenData.Exceptions;

using System;
using System.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;

namespace OpenData.Controllers
{
	[Route("/api/[controller]")]
	public class ExperiencePostController : Controller
	{
		private readonly IExperiencePostService _experiencePostService;
		private readonly IMapper _mapper;
		private readonly IUnitOfWork _unitOfWork;
		private readonly ITagService _tagService;
		private readonly IHttpContextAccessor httpContextRetriever;
		private readonly ICommentService commentService;

		public ExperiencePostController(IExperiencePostService metadataService, IMapper mapper, IUnitOfWork unitOfWork, ITagService tagService, ICommentService commentService, IHttpContextAccessor httpContextRetriever) 
		{
			_experiencePostService = metadataService;
			_mapper = mapper;
			_unitOfWork = unitOfWork;
			_tagService = tagService;
			this.commentService = commentService;
			this.httpContextRetriever = httpContextRetriever;
		}

		//TODO this needs authentication
		[HttpGet]
		public async Task<IEnumerable<ExperiencePostResource>> GetAllAsync()
		{
			var metadatas = await _experiencePostService.ListAsync();
			var resources = _mapper.Map<IEnumerable<ExperiencePost>, IEnumerable<ExperiencePostResource>>(metadatas);
			return resources;
		}

		/// <summary>
		/// Returns a single metadata type, and all its associated metadata entries.
		/// </summary> 
		[HttpGet("{uuid}")]
		public async Task<ExperiencePostResource> GetExperiencePost(string uuid)
		{
			try {
				var type = await _experiencePostService.GetByUuidAsync(Guid.Parse(uuid));
				var res = _mapper.Map<ExperiencePost, ExperiencePostResource>(type);
				return res;
			} catch (Exception) {
				throw new HttpException(HttpStatusCode.NotFound);
			}
		}

		/// <summary>
		/// Adds a new tag to an existing experience post.
		/// </summary>
		[HttpPut("{uuid}/tag")]
		public async Task<IActionResult> PostAsync([FromBody] Tag newTag, string uuid)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState.GetErrorMessages());

			//Try to fetch the metadata type, and return 404 if it doesnt exist
			ExperiencePost post = null;
			try {
				post = await _experiencePostService.GetByUuidAsync(Guid.Parse(uuid));
			} catch (Exception) {
				throw new HttpException(HttpStatusCode.NotFound);
			}

			// Same but with tags
			Tag tag = null;
			try {
				tag = await _tagService.GetByNameAsync(newTag.Name);
			} catch (Exception) {
				throw new HttpException(HttpStatusCode.NotFound);
			}

			if(post.Tags == null) {
				Console.WriteLine("Fuck");
			}

			post.Tags.Add(new ExperiencePostTagMapping { Tag = tag, Post = post});

			var res = _mapper.Map<ExperiencePost, ExperiencePostResource>(post);

			await _unitOfWork.CompleteAsync();
			return Ok(res);
		}

		/// <summary>
		/// Used to PUT comments related to a given Metadata.
		/// </summary>
		/// <param name="experiencePostGuid"></param>
		/// <param name="newComment">New comment to be added.</param>
		/// <returns>The comment if it was added successfully</returns>
		[HttpPut("{metadataGuid}/comments")]
		public async Task<IActionResult> PostCommentAsync(Guid experiencePostGuid, [FromBody] NewCommentResource newComment)
		{
			Comment comment = _mapper.Map<NewCommentResource, Comment>(newComment);
			comment.UserMail = httpContextRetriever.HttpContext.User.Identity.Name;

			await commentService.AddRootCommentToExperiencePostAsync(experiencePostGuid, comment);
			return Ok(comment);
		}

		/// <summary>
		/// Fethes all the comments by a given metadata GUID.
		/// </summary>
		/// <param name="uuid"></param>
		/// <returns>All of the comments for a given metadata GUID</returns>
		[HttpGet("{metadataGuid}/comments")]
		public async Task<IActionResult> GetCommentsAsync([FromBody] Guid metadataGuid)
		{
			IEnumerable<Comment> comments = await commentService.FetchCommentsForMetadataAsync(metadataGuid);
			return Ok(comments);
		}
	}
}