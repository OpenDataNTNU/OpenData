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
using OpenData.Domain.Services.Communication;

using System;
using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace OpenData.Controllers
{
    [Authorize]
	[Route("/api/[controller]")]
	public class MetadataController : Controller
	{
		private readonly IMetadataService _metadataService;
		private readonly IExperiencePostService _experiencePostService;
		private readonly IMapper _mapper;
		private readonly IUnitOfWork _unitOfWork;
		private readonly ILikeService _likeService;
		private readonly IHttpContextAccessor httpContextRetriever;
		private readonly IUserService userService;

		public MetadataController(
            IMetadataService metadataService,
            IExperiencePostService experiencePostService,
            IMapper mapper,
            IUnitOfWork unitOfWork,
			IHttpContextAccessor httpContextRetriever,
            IUserService userService,
            ILikeService likeService,
			      ICommentService commentService
            )
		{
			_metadataService = metadataService;
			_mapper = mapper;
			_unitOfWork = unitOfWork;
			_experiencePostService = experiencePostService;
			_likeService = likeService; 
			this.httpContextRetriever = httpContextRetriever;
			this.userService = userService;
		}

		[AllowAnonymous]
		[HttpGet]
		public async Task<IEnumerable<MetadataResource>> GetAllAsync()
		{
			var metadatas = await _metadataService.ListAsync();
			var resources = _mapper.Map<IEnumerable<Metadata>, IEnumerable<MetadataResource>>(metadatas);
			return resources;
		}

		/// <summary>
		/// Returns a single metadata type, and all its associated metadata entries.
		/// </summary>
        [AllowAnonymous]
		[HttpGet("{uuid}")]
		public async Task<MetadataResource> GetMetadata(string uuid)
		{
			try {
				var type = await _metadataService.GetByUuidAsync(Guid.Parse(uuid));
				var res = _mapper.Map<Metadata, MetadataResource>(type);
				return res;
			} catch (Exception) {
				throw new HttpException(HttpStatusCode.NotFound);
			}
		}

		/// <summary>
		/// Returns a single metadata type, and all its associated metadata entries.
		/// </summary> 
		[HttpPut("{uuid}/experience")]
		public async Task<IActionResult> SetExperience([FromBody] SaveExperiencePostResource experienceResource, string uuid)
		{
			var targetUsername = httpContextRetriever.HttpContext.User.Identity.Name;
            User user = await userService.GetUserByMailAsync(targetUsername);

			Metadata metadata = null; 
			try {
				metadata = await _metadataService.GetByUuidAsync(Guid.Parse(uuid));
			} catch (Exception) {
				throw new HttpException(HttpStatusCode.NotFound);
			}
			if (!ModelState.IsValid)
				return BadRequest(ModelState.GetErrorMessages());
			
			var experience = _mapper.Map<SaveExperiencePostResource, ExperiencePost>(experienceResource);

			experience.Modified = DateTime.UtcNow;
			experience.Created = DateTime.UtcNow;
			experience.LastEditedBy = user;

			var result = await _experiencePostService.SaveAsync(experience);

			metadata.ExperiencePost = experience;
			//commit change to metadata
			await _unitOfWork.CompleteAsync();

			var resultSafe = _mapper.Map<SaveExperiencePostResponse, SafeSaveExperiencePostResponse>(result);

			return Ok(resultSafe);
		}

		/// <summary>
		/// Returns like information about a dataset.
		/// </summary> 
		[AllowAnonymous]
		[HttpGet("{uuid}/like")]
		public async Task<IActionResult> GetLikes(string uuid)
		{
			var targetUsername = httpContextRetriever.HttpContext.User.Identity.Name;
            User user = await userService.GetUserByMailAsync(targetUsername);

            Metadata metadata = null; 
			try {
				metadata = await _metadataService.GetByUuidAsync(Guid.Parse(uuid));
			} catch (Exception) {
				throw new HttpException(HttpStatusCode.NotFound);
			}

            var likeReport = await _likeService.GetLikeReport(user, metadata);

			return Ok(likeReport);
		}

		/// <summary>
		/// Toggles whether or not the user has liked a metadata.
		/// </summary> 
		[HttpPut("{uuid}/like")]
		public async Task<IActionResult> SetLike(string uuid)
		{
			var targetUsername = httpContextRetriever.HttpContext.User.Identity.Name;
            User user = await userService.GetUserByMailAsync(targetUsername);

            Metadata metadata = null; 
			try {
				metadata = await _metadataService.GetByUuidAsync(Guid.Parse(uuid));
			} catch (Exception) {
				throw new HttpException(HttpStatusCode.NotFound);
			}
			//Check if the user has already liked it
			try {
				var existingLike = await _likeService.GetLikeByUserAndMetadata(user, metadata);

				if(existingLike != null) {
					await _likeService.DeleteLike(existingLike);
				}

			} catch (InvalidOperationException) {
				var like = new Like(){LikeUser = user, Metadata = metadata};

				await _likeService.SaveAsync(like);
			}

			await _unitOfWork.CompleteAsync();
			return Ok();
		}

		/// <summary>
		/// Returns like information about a dataset.
		/// </summary> 
		[HttpPut]
		public async Task<IActionResult> PostAsync([FromBody] SaveMetadataResource resource)
		{
			if (!ModelState.IsValid || !Enum.IsDefined(typeof(EReleaseState), resource.ReleaseState))
				return BadRequest(ModelState.GetErrorMessages());

			if (resource.ReleaseState == EReleaseState.Released && string.IsNullOrEmpty(resource.Url))
				return BadRequest("Url has to be supplied when releasestate is 'Released'");

			var username = httpContextRetriever.HttpContext.User.Identity.Name;
			var user = await userService.GetUserByMailAsync(username);
			if (user.UserType == UserType.Municipality && user.MunicipalityName == resource.MunicipalityName)
            {
				var metadata = _mapper.Map<SaveMetadataResource, Metadata>(resource);
				var result = await _metadataService.SaveAsync(metadata);

				if (!result.Success)
					return BadRequest(result.Message);

				var res = _mapper.Map<Metadata, MetadataResource>(metadata);

				await _unitOfWork.CompleteAsync();

				return Ok(res);
			}

            return Unauthorized("Invalid permissions!");
		}

	}
}