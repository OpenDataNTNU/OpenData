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
	/// <summary>
	/// Experience posts are documentation regarding the work required to publish a metadata.
	/// </summary> 
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
		/// <summary>
		/// Returns all experience posts in the database
		/// </summary> 
        /// <returns>A list of all experience posts</returns>
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
		/// <param name="uuid">UUID of experience post to fetch</param>
        /// <returns>The experience post, if it exists.</returns>
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
		/// <param name="newTag">The tag to attach to the experience post.</param>
		/// <param name="uuid">UUID of the experience post that the tag should be attached to</param>
        /// <returns>The experience post, with the tag attached.</returns>
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

			post.Tags.Add(new ExperiencePostTagMapping { Tag = tag, Post = post});

			var res = _mapper.Map<ExperiencePost, ExperiencePostResource>(post);

			await _unitOfWork.CompleteAsync();
			return Ok(res);
		}
	}
}