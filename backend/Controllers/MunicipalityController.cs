using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using OpenData.Domain.Models;
using OpenData.Domain.Services;
using OpenData.Services;

namespace OpenData.Controllers
{
	[Route("/api/[controller]")]
	public class MunicipalityController : Controller
	{
		private readonly IMunicipalityService _municipalityService;

		public MunicipalityController(IMunicipalityService municipalityService) 
		{
			_municipalityService = municipalityService;
		}

		[HttpGet]
		public async Task<IEnumerable<Municipality>> GetAllAsync()
		{
			var municipalities = await _municipalityService.ListAsync();
			return municipalities;
		}
	}
}