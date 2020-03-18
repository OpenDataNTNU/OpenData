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
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;

namespace OpenData.Controllers
{
    [Authorize]
	[Route("/api/[controller]")]
	public class TagController : Controller
	{
		private readonly ITagService _tagService;
		private readonly IMapper _mapper;
		private readonly IUnitOfWork _unitOfWork;
		private readonly IHttpContextAccessor httpContextRetriever;
		private readonly IUserService userService;

		public TagController(
            ITagService tagService,
            IMapper mapper,
            IUnitOfWork unitOfWork,
            IHttpContextAccessor httpContextRetriever,
		    IUserService userService
            ) 
		{
			_tagService = tagService;
			_mapper = mapper;
			_unitOfWork = unitOfWork;
			this.httpContextRetriever = httpContextRetriever;
			this.userService = userService;
		}

		/// <summary>
		/// Returns all known tags in the system.
		/// </summary> 
    /// <returns>All tags</returns>
    [AllowAnonymous]
		[HttpGet]
		public async Task<IEnumerable<Tag>> GetAllAsync()
		{
			var tags = await _tagService.ListAsync();
			return tags;
		}
		
		/// <summary>
		/// Creates a new tag
		/// </summary> 
		/// <param name="tag">The tag to create</param>
        /// <returns>The tag, if it was created</returns>
		[HttpPut]
		public async Task<IActionResult> PostAsync([FromBody] Tag tag)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState.GetErrorMessages());

			var username = httpContextRetriever.HttpContext.User.Identity.Name;
			var user = await userService.GetUserByMailAsync(username);

			if (user.UserType < UserType.Municipality)
				return BadRequest("Invalid user permissions, must have municipality privileges or higher.");

			var result = await _tagService.SaveAsync(tag);

			if(!result.Success)
				return BadRequest(result.Message);

			await _unitOfWork.CompleteAsync();

			return Ok(tag);
		}
	}
}