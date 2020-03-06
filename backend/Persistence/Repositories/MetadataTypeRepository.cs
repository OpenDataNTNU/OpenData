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
    public class MetadataTypeRepository : BaseRepository, IMetadataTypeRepository
    {
        public MetadataTypeRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<MetadataType>> ListAsync()
        {
            return await _context.MetadataTypes.Include(p => p.Tags).ToListAsync();
        }

        public async Task<MetadataType> GetByNameAsync(string name) {
            return await _context.MetadataTypes.Include(p => p.Tags).Include(p => p.MetadataList).ThenInclude(p => p.Format).FirstAsync(x => x.Name == name);
        }

        public async Task AddAsync(MetadataType metadata) {
            await _context.MetadataTypes.AddAsync(metadata);
        }

        public async Task<MetadataType> ListNamesAsync(string name)
        {
            return await _context.MetadataTypes.SingleOrDefaultAsync<MetadataType>(p => p.Name == name);
        }

        public async Task<IEnumerable<IList<MetadataTypeTagMapping>>> ListTagsAsync()
        {
            return await _context.MetadataTypes.Select(p => p.Tags).ToListAsync();
        }
    }
}