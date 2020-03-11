using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OpenData.Domain.Models;
using OpenData.Domain.Repositories;
using OpenData.Persistence.Contexts;
using System.Web;
using System;
using System.Linq;

namespace OpenData.Persistence.Repositories
{
    public class MetadataRepository : BaseRepository, IMetadataRepository
    {
        public MetadataRepository(AppDbContext context) : base(context)
        {

        }

        public async Task<IEnumerable<Metadata>> ListAsync()
        {
            return await _context.Metadata
                .Include(m => m.DataSource)
                .ThenInclude(d => d.DataFormat)
                .ToListAsync();
        }

        public async Task<Metadata> GetByUuidAsync(Guid uuid) {
            return await _context.Metadata
                .Include(m => m.DataSource)
                .ThenInclude(d => d.DataFormat)
                .FirstAsync(m => m.Uuid == uuid);
        }

        public async Task AddAsync(Metadata metadata) {
            await _context.Metadata.AddAsync(metadata);
        }

        public async Task PutDataSourceAsync(DataSource dataSource)
        {
            await _context.DataSource.AddAsync(dataSource);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteDataSourceAsync(Guid dataSourceUuid)
        {
            var dataSource = await _context.DataSource
                .Where(d => d.Uuid == dataSourceUuid)
                .SingleAsync();
            _context.DataSource.Remove(dataSource);
            await _context.SaveChangesAsync();
        }

        public async Task<DataSource> GetDataSourceByUuid(Guid dataSourceUuid)
        {
            return await _context.DataSource.SingleOrDefaultAsync(d => d.Uuid == dataSourceUuid);
        }
    }
}