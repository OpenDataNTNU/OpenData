using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OpenData.Domain.Models;
using OpenData.Domain.Repositories;
using OpenData.Persistence.Contexts;
using System.Linq;
using System.Web;
using System;

namespace OpenData.Persistence.Repositories
{
    public class MetadataCategoryRepository : BaseRepository, IMetadataCategoryRepository
    {
        public MetadataCategoryRepository(AppDbContext context) : base(context)
        {

        }

        public async Task<IEnumerable<MetadataCategory>> ListRootElementsAsync()
        {
            return await _context.MetadataCategory
                .Where(m => m.Parent == null)
                .Include(x => x.Children)
                    .ThenInclude(x => x.Types)
                .Include(x => x.Types)
                .ToListAsync();
        }

        public async Task<MetadataCategory> GetByUuidAsync(Guid uuid) {
            return await _context.MetadataCategory
                .Include(x => x.Children)
                    .ThenInclude(x => x.Types)
                .Include(x => x.Types)
                .FirstAsync(x => x.Uuid == uuid);
        }

        public async Task AddAsync(MetadataCategory category) {
            await _context.MetadataCategory.AddAsync(category);
        }
    }
}