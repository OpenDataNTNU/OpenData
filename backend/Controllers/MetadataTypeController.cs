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

using System;
using System.Net;

namespace OpenData.Controllers
{
	[Route("/api/[controller]")]
	public class MetadataTypeController : Controller
	{
		private readonly IMetadataTypeService _metadataTypeService;
		private readonly ITagService _tagService;
		private readonly IMapper _mapper;
		private readonly IUnitOfWork _unitOfWork;

		public MetadataTypeController(IMetadataTypeService metadataTypeService, ITagService tagService, IMapper mapper, IUnitOfWork unitOfWork) 
		{
			_metadataTypeService = metadataTypeService;
			_tagService = tagService;
			_mapper = mapper;
			_unitOfWork = unitOfWork;
		}

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
		[HttpGet("{name}")]
		public async Task<MetadataTypeResource> GetMetadataTypeDeepCopy(string name)
		{
			var type = await _metadataTypeService.GetByNameAsync(WebUtility.UrlDecode(name));
			var res = _mapper.Map<MetadataType, MetadataTypeResource>(type);
			return res;
		}

		/// <summary>
		/// Allows the creation of a new Metadata Type
		/// </summary>
		[HttpPut]
		public async Task<IActionResult> PostAsync([FromBody] SaveMetadataTypeResource resource)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState.GetErrorMessages());

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

			var type = await _metadataTypeService.GetByNameAsync(WebUtility.UrlDecode(name));
			var tag = await _tagService.GetByNameAsync(newTag.Name);

			type.Tags.Add(new MetadataTypeTagMapping { Tag = tag, Type = type});

			var res = _mapper.Map<MetadataType, MetadataTypeResource>(type);

			await _unitOfWork.CompleteAsync();
			return Ok(res);
		}
	}
}