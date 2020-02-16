using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
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
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace OpenData.Controllers
{
    [Authorize]
	[Route("/api/[controller]")]
	public class MetadataController : Controller
	{
		private readonly IMetadataService _metadataService;
		private readonly IMapper _mapper;
		private readonly IUnitOfWork _unitOfWork;
		private readonly IHttpContextAccessor httpContextRetriever;
		private readonly IUserService userService;

		public MetadataController(
            IMetadataService metadataService,
            IMapper mapper,
            IUnitOfWork unitOfWork,
			IHttpContextAccessor httpContextRetriever,
            IUserService userService
            ) 
		{
			_metadataService = metadataService;
			_mapper = mapper;
			_unitOfWork = unitOfWork;
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
			} catch (Exception ex) {
				throw new HttpException(HttpStatusCode.NotFound);
			}
		}

		[HttpPut]
		public async Task<IActionResult> PostAsync([FromBody] SaveMetadataResource resource)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState.GetErrorMessages());

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