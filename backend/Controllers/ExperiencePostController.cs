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
	public class ExperiencePostController : Controller
	{
		private readonly IExperiencePostService _experiencePostService;
		private readonly IMapper _mapper;
		private readonly IUnitOfWork _unitOfWork;

		public ExperiencePostController(IExperiencePostService metadataService, IMapper mapper, IUnitOfWork unitOfWork) 
		{
			_experiencePostService = metadataService;
			_mapper = mapper;
			_unitOfWork = unitOfWork;
		}

		//TODO this needs authentication
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
		[HttpGet("{uuid}")]
		public async Task<ExperiencePostResource> GetExperiencePost(string uuid)
		{
			try {
				var type = await _experiencePostService.GetByUuidAsync(Guid.Parse(uuid));
				var res = _mapper.Map<ExperiencePost, ExperiencePostResource>(type);
				return res;
			} catch (Exception ex) {
				throw new HttpException(HttpStatusCode.NotFound);
			}
		}
	}
}