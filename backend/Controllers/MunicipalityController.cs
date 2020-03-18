using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using AutoMapper;
using OpenData.Domain.Models;
using OpenData.Domain.Services;
using OpenData.Resources;
using OpenData.Services;

namespace OpenData.Controllers
{
	[Route("/api/[controller]")]
	public class MunicipalityController : Controller
	{
		private readonly IMunicipalityService _municipalityService;
		private readonly IMapper _mapper;

		public MunicipalityController(IMunicipalityService municipalityService, IMapper mapper) 
		{
			_municipalityService = municipalityService;
			_mapper = mapper;
		}

		/// <summary>
		/// Returns a list of all municipalities known to this service.
		/// </summary> 
        /// <returns>The municipalities that are stored in the database.</returns>
		[HttpGet]
		public async Task<IEnumerable<MunicipalityResource>> GetAllAsync()
		{
			var municipalities = await _municipalityService.ListAsync();
			var resources = _mapper.Map<IEnumerable<Municipality>, IEnumerable<MunicipalityResource>>(municipalities);
			return resources;
		}

		/// <summary>
		/// Returns data about a single municipality
		/// </summary> 
		/// <param name="name">The municipality to fetch data about</param>
        /// <returns>The municipality, if it exists</returns>
		[HttpGet("{name}")]
		public async Task<IActionResult> GetSingleAsync(string name)
		{
			var municipality = await _municipalityService.FetchByName(name);
			if (municipality == null)
			{
				return BadRequest("No municipality with that name");
			}
			else
			{
				var resource = _mapper.Map<Municipality, MunicipalityResource>(municipality);
				return Ok(resource);
			}
		}
	}
}