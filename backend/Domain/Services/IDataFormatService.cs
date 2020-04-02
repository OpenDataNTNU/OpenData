using System.Collections.Generic;
using System.Threading.Tasks;
using System;

using OpenData.Domain.Services.Communication;
using OpenData.Domain.Models;

namespace OpenData.Domain.Services
{
    public interface IDataFormatService
    {
         Task<IEnumerable<DataFormat>> ListAsync();
         Task<DataFormat> GetByMimeTypeAsync(string mime);
         Task<SaveDataFormatResponse> SaveAsync(DataFormat format);
    }
}