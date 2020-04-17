using System.Collections.Generic;
using System.Threading.Tasks;
using System;

using OpenData.Domain.Models;

namespace OpenData.Domain.Repositories
{
    public interface IDataFormatRepository
    {
         Task<IEnumerable<DataFormat>> ListAsync();
         Task<DataFormat> GetByMimeTypeAsync(string mime);
         Task AddAsync(DataFormat tag);
    }
}