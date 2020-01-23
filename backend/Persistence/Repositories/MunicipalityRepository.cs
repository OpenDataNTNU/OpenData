using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OpenData.Domain.Models;
using OpenData.Domain.Repositories;
using OpenData.Persistence.Contexts;

namespace OpenData.Persistence.Repositories
{
    public class MunicipalityRepository : BaseRepository, IMunicipalityRepository
    {
        public MunicipalityRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Municipality>> ListAsync()
        {
            return await _context.Municipalities.ToListAsync();
        }
    }
}