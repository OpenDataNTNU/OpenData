using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OpenData.Domain.Models;
using OpenData.Domain.Repositories;
using OpenData.Persistence.Contexts;
using System.Web;
using System;

namespace OpenData.Persistence.Repositories
{
    public class TagRepository : BaseRepository, ITagRepository
    {
        public TagRepository(AppDbContext context) : base(context)
        {

        }

        public async Task<IEnumerable<Tag>> ListAsync()
        {
            return await _context.Tags.ToListAsync();
        }

        public async Task<Tag> GetByNameAsync(string name) {
            return await _context.Tags.FirstAsync(x => x.Name == name);
        }
        
        public async Task AddAsync(Tag tag) {
            await _context.Tags.AddAsync(tag);
        }
    }
}