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
	public class MetadataCategoryController : Controller
	{
		private readonly IMetadataCategoryService _metadataCategoryService;
		private readonly IMapper _mapper;
		private readonly IUnitOfWork _unitOfWork;
		private readonly ILikeService _likeService;
		private readonly IHttpContextAccessor httpContextRetriever;
		private readonly IUserService userService;

		public MetadataCategoryController(
            IMetadataCategoryService metadataCategoryService,
            IMapper mapper,
            IUnitOfWork unitOfWork,
			IHttpContextAccessor httpContextRetriever,
            IUserService userService,
            ILikeService likeService,
			      ICommentService commentService
            )
		{
			_metadataCategoryService = metadataCategoryService;
			_mapper = mapper;
			_unitOfWork = unitOfWork;
			_likeService = likeService; 
			this.httpContextRetriever = httpContextRetriever;
			this.userService = userService;
		}

		/// <summary>
		/// Returns a list of root nodes in the metadata category system
		/// </summary> 
        /// <returns>Root nodes</returns>
		[AllowAnonymous]
		[HttpGet]
		public async Task<IEnumerable<MetadataCategoryResource>> GetRootNodesAsync()
		{
			var categories = await _metadataCategoryService.ListRootElementsAsync();
			var resources = _mapper.Map<IEnumerable<MetadataCategory>, IEnumerable<MetadataCategoryResource>>(categories);
			return resources;
		}

		/// <summary>
		/// Returns a single category node
		/// </summary>
		/// <param name="uuid">UUID of the category to fetch</param>
        /// <returns>The category node</returns>
        [AllowAnonymous]
		[HttpGet("{uuid}")]
		public async Task<MetadataCategoryResource> GetCategory(string uuid)
		{
			try {
				var category = await _metadataCategoryService.GetByUuidAsync(Guid.Parse(uuid));
				var res = _mapper.Map<MetadataCategory, MetadataCategoryResource>(category);
				return res;
			} catch (Exception) {
				throw new HttpException(HttpStatusCode.NotFound);
			}
		}

		/// <summary>
		/// Creates a category node.
		/// </summary> 
		/// <param name="category">The category node to be created</param>
        /// <returns>The category node, if everything was successful</returns>
		[HttpPut]
		public async Task<IActionResult> PostAsync([FromBody] SaveMetadataCategoryResource categoryResource)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState.GetErrorMessages());

			var username = httpContextRetriever.HttpContext.User.Identity.Name;
			var user = await userService.GetUserByMailAsync(username);
			if (user.UserType == UserType.Municipality)
            {
            	//Fetch the parent
            	if(categoryResource.ParentUuid != null) {
            		Guid guid = (Guid)categoryResource.ParentUuid;
            		var parent = await _metadataCategoryService.GetByUuidAsync(guid);
            		if(parent == null) {
            			throw new HttpException(HttpStatusCode.NotFound);
            		}
            		parent.HasChildren = true;
            	}

				var category = _mapper.Map<SaveMetadataCategoryResource, MetadataCategory>(categoryResource);

				var result = await _metadataCategoryService.SaveAsync(category);

				if (!result.Success)
					return BadRequest(result.Message);

				var res = _mapper.Map<MetadataCategory, MetadataCategoryResource>(category);

				await _unitOfWork.CompleteAsync();

				return Ok(res);
			}

            return Unauthorized("Invalid permissions!");
		}

	}
}