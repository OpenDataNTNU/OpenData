using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OpenData.Domain.Models;
using OpenData.Domain.Repositories;
using OpenData.Persistence.Contexts;
using System.Web;
using System;
using System.Linq;
using OpenData.Resources;

namespace OpenData.Persistence.Repositories
{
    public class MetadataTypeRepository : BaseRepository, IMetadataTypeRepository
    {
        public MetadataTypeRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<MetadataType>> ListAsync()
        {
            return await _context.MetadataTypes.Include(p => p.Tags).ToListAsync();
        }

        public async Task<MetadataType> GetByUuidAsync(Guid uuid) {
            return await _context.MetadataTypes
                .Include(p => p.Tags)
                .Include(p => p.MetadataList)
                .ThenInclude(p => p.DataSource)
                .ThenInclude(p => p.DataFormat)
                .FirstAsync(x => x.Uuid == uuid);
        }

        public async Task AddAsync(MetadataType metadata) {
            await _context.MetadataTypes.AddAsync(metadata);
        }

        public async Task<IEnumerable<MetadataType>> FilterSearchAsync(MetadataTypeSearchParametersResource searchParams)
        {
            return await _context.MetadataTypes
                .Where(m => m.Name.Contains(searchParams.Name, StringComparison.OrdinalIgnoreCase))
                .Where(m => searchParams.Tags == null ||
                            searchParams.Tags.Count() == 0 ||
                            m.Tags.Select(t => t.TagName).Any(tname => searchParams.Tags.Select(t => t.Name).Contains(tname)))
                .Where(m => m.Description.Contains(searchParams.Keywords, StringComparison.OrdinalIgnoreCase))
                .ToListAsync();
        }
    }
}
