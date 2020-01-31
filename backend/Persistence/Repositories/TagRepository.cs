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
        
        public async Task AddAsync(Tag tag) {
            await _context.Tags.AddAsync(tag);
            await _context.SaveChangesAsync(); //This can also be done with UnitOfWork, but it seemed like too much of a hassle - see the tutorial
        }
    }
}