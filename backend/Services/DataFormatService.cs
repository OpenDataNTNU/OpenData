using System.Collections.Generic;
using System.Threading.Tasks;
using System;

using OpenData.Domain.Models;
using OpenData.Domain.Repositories;
using OpenData.Domain.Services;
using OpenData.Domain.Services.Communication;

namespace OpenData.Services
{
    public class DataFormatService : IDataFormatService
    {
    	private readonly IDataFormatRepository _dataFormatRepository;

    	public DataFormatService(IDataFormatRepository dataFormatRepository) 
    	{
    		_dataFormatRepository = dataFormatRepository;
    	}

        public async Task<IEnumerable<DataFormat>> ListAsync()
        {
        	return await _dataFormatRepository.ListAsync();
        }

        public async Task<DataFormat> GetByMimeTypeAsync(string mime) {
            return await _dataFormatRepository.GetByMimeTypeAsync(mime);
        }
        
        public async Task<SaveDataFormatResponse> SaveAsync(DataFormat dataFormat) {
            try
            {
                await _dataFormatRepository.AddAsync(dataFormat);
                
                return new SaveDataFormatResponse(dataFormat);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new SaveDataFormatResponse($"An error occurred when saving the data format: {ex.Message}");
            }
        }
    }
}