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

using System;
using System.Net;

namespace OpenData.Controllers
{
	[Route("/api/[controller]")]
	public class TagController : Controller
	{
		private readonly ITagService _tagService;
		private readonly IMapper _mapper;
		private readonly IUnitOfWork _unitOfWork;

		public TagController(ITagService tagService, IMapper mapper, IUnitOfWork unitOfWork) 
		{
			_tagService = tagService;
			_mapper = mapper;
			_unitOfWork = unitOfWork;
		}

		/// <summary>
		/// Returns all known tags in the system.
		/// </summary> 
		[HttpGet]
		public async Task<IEnumerable<Tag>> GetAllAsync()
		{
			var tags = await _tagService.ListAsync();
			return tags;
		}
		
		/// <summary>
		/// Creates a new tag
		/// </summary> 
		[HttpPut]
		public async Task<IActionResult> PostAsync([FromBody] Tag tag)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState.GetErrorMessages());

			var result = await _tagService.SaveAsync(tag);

			if(!result.Success)
				return BadRequest(result.Message);

			await _unitOfWork.CompleteAsync();

			return Ok(tag);
		}
	}
}