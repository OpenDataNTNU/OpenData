using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using AutoMapper;
using OpenData.Domain.Models;
using OpenData.Domain.Services;
using OpenData.Resources;
using OpenData.Services;

using System;
using System.Net;

namespace OpenData.Controllers
{
	[Route("/api/[controller]")]
	public class MetadataTypeController : Controller
	{
		private readonly IMetadataTypeService _metadataTypeService;
		private readonly IMapper _mapper;

		public MetadataTypeController(IMetadataTypeService metadataTypeService, IMapper mapper) 
		{
			_metadataTypeService = metadataTypeService;
			_mapper = mapper;
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
	}
}