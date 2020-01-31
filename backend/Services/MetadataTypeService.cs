using System.Collections.Generic;
using System.Threading.Tasks;
using OpenData.Domain.Models;
using OpenData.Domain.Repositories;
using OpenData.Domain.Services;

namespace OpenData.Services
{
    public class MetadataTypeService : IMetadataTypeService
    {
    	private readonly IMetadataTypeRepository _metadataTypeRepository;

    	public MetadataTypeService(IMetadataTypeRepository metadataTypeRepository) 
    	{
    		_metadataTypeRepository = metadataTypeRepository;
    	}

        public async Task<IEnumerable<MetadataType>> ListAsync()
        {
        	return await _metadataTypeRepository.ListAsync();
        }

        public async Task<MetadataType> GetByNameAsync(string name) {
            return await _metadataTypeRepository.GetByNameAsync(name);
        }
    }
}