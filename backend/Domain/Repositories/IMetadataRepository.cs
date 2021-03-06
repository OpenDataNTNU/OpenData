using System.Collections.Generic;
using System.Threading.Tasks;
using System;

using OpenData.Domain.Models;

namespace OpenData.Domain.Repositories
{
    public interface IMetadataRepository
    {
        Task<IEnumerable<Metadata>> ListAsync();
        Task<Metadata> GetByUuidAsync(Guid uuid);
        Task AddAsync(Metadata metadata);
        Task PutDataSourceAsync(DataSource dataSource);
        Task DeleteDataSourceAsync(Guid dataSourceUuid);
        Task<DataSource> GetDataSourceByUuid(Guid dataSourceUuid);
    }
}