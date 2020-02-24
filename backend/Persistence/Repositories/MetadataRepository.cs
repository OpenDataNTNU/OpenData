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
            return await _context.Metadata.ToListAsync();
        }

        public async Task<Metadata> GetByUuidAsync(Guid uuid) {
            return await _context.Metadata.FirstAsync(x => x.Uuid == uuid);
        }

        public async Task AddAsync(Metadata metadata) {
            await _context.Metadata.AddAsync(metadata);
        }

        public async Task AddCommentAsync(Comment comment)
        {
            await _context.Comment.AddAsync(comment);
        }

        public async Task<IEnumerable<Comment>> FetchCommentsAsync(string uuid)
        {
            return await _context.Comment.Where(p => p.MetadataUuid == uuid).OrderBy(p => p.Published).ToListAsync();
        }
    }
}