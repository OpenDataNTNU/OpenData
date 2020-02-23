using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
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

        public async Task<Municipality> FetchByName(string name)
        {
            return await _context.Municipalities.SingleOrDefaultAsync<Municipality>((mun) => mun.Name == name);
        }

        public async Task<Municipality> GetMunicipalityByDomainAsync(string domain)
        {
            return await _context.Municipalities.SingleOrDefaultAsync<Municipality>((mun) => mun.MailDomain == domain);
        }
    }
}