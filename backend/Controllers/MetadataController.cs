using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using AutoMapper;
using OpenData.Domain.Models;
using OpenData.Domain.Services;
using OpenData.Resources;
using OpenData.Services;
using OpenData.Extensions;

using System;
using System.Net;

namespace OpenData.Controllers
{
	[Route("/api/[controller]")]
	public class MetadataController : Controller
	{
		private readonly IMetadataService _metadataService;
		private readonly IMapper _mapper;

		public MetadataController(IMetadataService metadataService, IMapper mapper) 
		{
			_metadataService = metadataService;
			_mapper = mapper;
		}

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
		[HttpGet("{uuid}")]
		public async Task<MetadataResource> GetMetadata(string uuid)
		{
			var type = await _metadataService.GetByUuidAsync(Guid.Parse(uuid));
			var res = _mapper.Map<Metadata, MetadataResource>(type);
			return res;
		}

		[HttpPut]
		public async Task<IActionResult> PostAsync([FromBody] SaveMetadataResource resource)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState.GetErrorMessages());

			var metadata = _mapper.Map<SaveMetadataResource, Metadata>(resource);
			var result = await _metadataService.SaveAsync(metadata);

			if(!result.Success)
				return BadRequest(result.Message);

			var res = _mapper.Map<Metadata, MetadataResource>(metadata);

			return Ok(res);
		}
	}
}