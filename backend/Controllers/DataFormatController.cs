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
	public class DataFormatController : Controller
	{
		private readonly IDataFormatService _formatService;
		private readonly IUnitOfWork _unitOfWork;
		private readonly IHttpContextAccessor httpContextRetriever;
		private readonly IUserService userService;
		private readonly IMapper _mapper;

		public DataFormatController(
            IDataFormatService formatService,
            IMapper mapper,
            IUnitOfWork unitOfWork,
            IHttpContextAccessor httpContextRetriever,
		    IUserService userService
            ) 
		{
			_formatService = formatService;
			_unitOfWork = unitOfWork;
			_mapper = mapper;
			this.httpContextRetriever = httpContextRetriever;
			this.userService = userService;
		}

		/// <summary>
		/// Returns all known data formats in the system
		/// </summary> 
    	/// <returns>All data formats</returns>
   		[AllowAnonymous]
		[HttpGet]
		public async Task<IEnumerable<DataFormat>> GetAllAsync()
		{
			var tags = await _formatService.ListAsync();
			return tags;
		}
		
		/// <summary>
		/// Adds a data format to the database
		/// </summary> 
		/// <param name="format">The format to add</param>
        /// <returns>The format, if it was created</returns>
		[HttpPut]
		public async Task<IActionResult> PostAsync([FromBody] NewDataFormatResource format)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState.GetErrorMessages());

			var username = httpContextRetriever.HttpContext.User.Identity.Name;
			var user = await userService.GetUserByMailAsync(username);

			if (user.UserType < UserType.Municipality)
				return BadRequest("Invalid user permissions, must have municipality privileges or higher.");

			var res = _mapper.Map<NewDataFormatResource, DataFormat>(format);
			var result = await _formatService.SaveAsync(res);

			if(!result.Success)
				return BadRequest(result.Message);

			await _unitOfWork.CompleteAsync();

			return Ok(format);
		}
	}
}