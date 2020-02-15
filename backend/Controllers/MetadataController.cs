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

namespace OpenData.Controllers
{
	[Route("/api/[controller]")]
	public class MetadataController : Controller
	{
		private readonly IMetadataService _metadataService;
		private readonly IExperiencePostService _experiencePostService;
		private readonly IMapper _mapper;
		private readonly IUnitOfWork _unitOfWork;

		public MetadataController(IMetadataService metadataService, IExperiencePostService experiencePostService, IMapper mapper, IUnitOfWork unitOfWork) 
		{
			_metadataService = metadataService;
			_mapper = mapper;
			_unitOfWork = unitOfWork;
			_experiencePostService = experiencePostService;
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
			try {
				var type = await _metadataService.GetByUuidAsync(Guid.Parse(uuid));
				var res = _mapper.Map<Metadata, MetadataResource>(type);
				return res;
			} catch (Exception ex) {
				throw new HttpException(HttpStatusCode.NotFound);
			}
		}

		/// <summary>
		/// Returns a single metadata type, and all its associated metadata entries.
		/// </summary> 
		[HttpPut("{uuid}/experience")]
		public async Task<IActionResult> SetExperience([FromBody] SaveExperiencePostResource experienceResource, string uuid)
		{
			Metadata metadata = null; 
			try {
				metadata = await _metadataService.GetByUuidAsync(Guid.Parse(uuid));
			} catch (Exception) {
				throw new HttpException(HttpStatusCode.NotFound);
			}
				var experience = _mapper.Map<SaveExperiencePostResource, ExperiencePost>(experienceResource);

				experience.Modified = DateTime.UtcNow;
				experience.Created = DateTime.UtcNow;

				var result = await _experiencePostService.SaveAsync(experience);

				metadata.ExperiencePost = experience;
				//commit change to metadata
				await _unitOfWork.CompleteAsync();

				return Ok(result);
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

			await _unitOfWork.CompleteAsync();

			return Ok(res);
		}
	}
}