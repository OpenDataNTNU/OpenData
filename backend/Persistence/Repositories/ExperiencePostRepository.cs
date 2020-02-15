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
    public class ExperiencePostRepository : BaseRepository, IExperiencePostRepository
    {
        public ExperiencePostRepository(AppDbContext context) : base(context)
        {

        }

        public async Task<IEnumerable<ExperiencePost>> GetListAsync()
        {
            return await _context.ExperiencePosts.ToListAsync();
        }

        public async Task<ExperiencePost> GetByUuidAsync(Guid uuid) {
            return await _context.ExperiencePosts.Include(p => p.Tags).FirstAsync(x => x.Uuid == uuid);
        }

        public async Task AddAsync(ExperiencePost experiencePost) {
            await _context.ExperiencePosts.AddAsync(experiencePost);
        }
    }
}