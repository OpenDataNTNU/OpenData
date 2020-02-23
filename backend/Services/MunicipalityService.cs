using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.Domain.Models;
using OpenData.Domain.Repositories;
using OpenData.Domain.Services;

namespace OpenData.Services
{
    public class MunicipalityService : IMunicipalityService
    {
    	private readonly IMunicipalityRepository _municipalityRepository;

    	public MunicipalityService(IMunicipalityRepository municipalityRepository) 
    	{
    		_municipalityRepository = municipalityRepository;
    	}

        public async Task<Municipality> GetMunicipalityByDomainAsync(string domain)
        {
            return await _municipalityRepository.GetMunicipalityByDomainAsync(domain);
        }

        public async Task<IEnumerable<Municipality>> ListAsync()
        {
        	return await _municipalityRepository.ListAsync();
        }

        public async Task<Municipality> FetchByName(string name)
        {
            return await _municipalityRepository.FetchByName(name);
        }
    }
}