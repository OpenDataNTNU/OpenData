using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

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

		[HttpGet]
		public async Task<IEnumerable<MunicipalityResource>> GetAllAsync()
		{
			var municipalities = await _municipalityService.ListAsync();
			var resources = _mapper.Map<IEnumerable<Municipality>, IEnumerable<MunicipalityResource>>(municipalities);
			return resources;
		}
	}
}