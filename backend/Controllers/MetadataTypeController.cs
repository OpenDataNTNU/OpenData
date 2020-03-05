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
		private readonly ITagService _tagService;
		private readonly IMapper _mapper;
		private readonly IUnitOfWork _unitOfWork;
		private readonly IHttpContextAccessor httpContextRetriever;
		private readonly IUserService userService;

		public MetadataTypeController(
            IMetadataTypeService metadataTypeService,
            ITagService tagService,
            IMapper mapper,
            IUnitOfWork unitOfWork,
			IHttpContextAccessor httpContextRetriever,
			IUserService userService
			) 
		{
			_metadataTypeService = metadataTypeService;
			_tagService = tagService;
			_mapper = mapper;
			_unitOfWork = unitOfWork;
			this.httpContextRetriever = httpContextRetriever;
			this.userService = userService;
		}

		/// <summary>
		/// Returns all metadata types in the database.
		/// </summary> 
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
		[AllowAnonymous]
		[HttpGet("{name}")]
		public async Task<MetadataTypeResource> GetMetadataTypeDeepCopy(string name)
		{
			try {
				var type = await _metadataTypeService.GetByNameAsync(WebUtility.UrlDecode(name));
				var res = _mapper.Map<MetadataType, MetadataTypeResource>(type);
				return res;
			} catch (Exception) {
				throw new HttpException(HttpStatusCode.NotFound);
			}
		}

		/// <summary>
		/// Allows the creation of a new Metadata Type
		/// </summary>
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

			if(!result.Success)
				return BadRequest(result.Message);

			var res = _mapper.Map<MetadataType, MetadataTypeResource>(metadataType);

			await _unitOfWork.CompleteAsync();
			return Ok(res);
		}

		/// <summary>
		/// Adds a new tag to an existing metadata type.
		/// </summary>
		[HttpPut("{name}/tag")]
		public async Task<IActionResult> PostAsync([FromBody] Tag newTag, string name)
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
				type = await _metadataTypeService.GetByNameAsync(WebUtility.UrlDecode(name));
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