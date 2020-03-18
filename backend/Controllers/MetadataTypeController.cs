using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using AutoMapper;
using OpenData.Domain.Models;
using OpenData.Domain.Services;
using OpenData.Domain.Repositories;
using OpenData.Domain.Services.Communication;
using OpenData.Resources;
using OpenData.Services;
using OpenData.Extensions;
using OpenData.Exceptions;

using System;
using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace OpenData.Controllers
{
	[Authorize]
	[Route("/api/[controller]")]
	public class MetadataTypeController : Controller
	{
		private readonly IMetadataTypeService _metadataTypeService;
		private readonly IMetadataCategoryService _metadataCategoryService;
		private readonly ITagService _tagService;
		private readonly IMapper _mapper;
		private readonly IUnitOfWork _unitOfWork;
		private readonly IHttpContextAccessor httpContextRetriever;
		private readonly IUserService userService;

		public MetadataTypeController(
            IMetadataTypeService metadataTypeService,
            IMetadataCategoryService metadataCategoryService,
            ITagService tagService,
            IMapper mapper,
            IUnitOfWork unitOfWork,
			IHttpContextAccessor httpContextRetriever,
			IUserService userService
			) 
		{
			_metadataTypeService = metadataTypeService;
			_metadataCategoryService = metadataCategoryService;
			_tagService = tagService;
			_mapper = mapper;
			_unitOfWork = unitOfWork;
			this.httpContextRetriever = httpContextRetriever;
			this.userService = userService;
		}

		/// <summary>
		/// Returns all metadata types in the database.
		/// </summary> 
        /// <returns>All metadata types in the database</returns>
        [AllowAnonymous]
		[HttpGet]
		public async Task<IEnumerable<MetadataTypeResource>> GetAllAsync()
		{
			var metadataTypes = await _metadataTypeService.ListAsync();
			var resources = _mapper.Map<IEnumerable<MetadataType>, IEnumerable<MetadataTypeResource>>(metadataTypes);
			return resources;
		}

		/// <summary>
		/// Returns a single metadata type, and all its associated metadata entries.
		/// </summary> 
		/// <param name="uuid">Uuid of the metadata type to fetch</param>
        /// <returns>The metadata type, if it exists</returns>
		[AllowAnonymous]
		[HttpGet("{uuid}")]
		public async Task<MetadataTypeResource> GetMetadataTypeDeepCopy(Guid uuid)
		{
			try {
				var type = await _metadataTypeService.GetByUuidAsync(uuid);
				var res = _mapper.Map<MetadataType, MetadataTypeResource>(type);
				return res;
			} catch (Exception) {
				throw new HttpException(HttpStatusCode.NotFound);
			}
		}

		/// <summary>
		/// Creates a new Metadata Type
		/// </summary>
		/// <param name="resource">The metadata type to create</param>
        /// <returns>The metadata type, if it was created successfully</returns>
		[HttpPut]
		public async Task<IActionResult> PostAsync([FromBody] SaveMetadataTypeResource resource)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState.GetErrorMessages());

			var username = httpContextRetriever.HttpContext.User.Identity.Name;
			var user = await userService.GetUserByMailAsync(username);

            if(user.UserType < UserType.Municipality)
            {
				return Unauthorized("Invalid permission for creation of a new MetadataType");
            }

			var metadataType = _mapper.Map<SaveMetadataTypeResource, MetadataType>(resource);
			var result = await _metadataTypeService.SaveAsync(metadataType);

			//Make sure the metadata category knows it has a type
			var metadataCategory = await _metadataCategoryService.GetByUuidAsync(resource.CategoryUuid);
			metadataCategory.HasTypes = true;

			if(!result.Success)
				return BadRequest(result.Message);

			var res = _mapper.Map<MetadataType, MetadataTypeResource>(metadataType);

			await _unitOfWork.CompleteAsync();
			return Ok(res);
		}

		/// <summary>
		/// Adds a new tag to an existing metadata type.
		/// </summary>
		/// <param name="uuid">The metadata type to attach the tag to</param>
		/// <param name="newTag">The tag to attach to the metadata type</param>
        /// <returns>The metadata type, with the tag attached</returns>
		[HttpPut("{uuid}/tag")]
		public async Task<IActionResult> PostAsync([FromBody] Tag newTag, Guid uuid)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState.GetErrorMessages());

			var username = httpContextRetriever.HttpContext.User.Identity.Name;
			var user = await userService.GetUserByMailAsync(username);

			if (user.UserType < UserType.Municipality)
			{
				return Unauthorized("Invalid permission for addition of a new tag to a MetadataType");
			}

			//Try to fetch the metadata type, and return 404 if it doesnt exist
			MetadataType type = null;
			try {
				type = await _metadataTypeService.GetByUuidAsync(uuid);
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

			type.Tags.Add(new MetadataTypeTagMapping { Tag = tag, Type = type});

			var res = _mapper.Map<MetadataType, MetadataTypeResource>(type);

			await _unitOfWork.CompleteAsync();
			return Ok(res);
		}

		/// <summary>
		/// Filter/search on MetadataTypes
		/// </summary>
		/// <param name="searchParams">SearchParams object that includes name, Tags and keywords</param>
		/// <returns>The return type of this is enum list of metadatatypes</returns>
		[AllowAnonymous]
		[HttpGet("search")]
		public async Task<IActionResult> FilterSearchAsync([FromBody] MetadataTypeSearchParametersResource searchParams)
		{
			var metadataTypes = await _metadataTypeService.FilterSearchAsync(searchParams);
			var retMetadataTypes = _mapper.Map<IEnumerable<MetadataType>, IEnumerable<MetadataTypeResource>>(metadataTypes);
			return Ok(retMetadataTypes);
		}
	}
}