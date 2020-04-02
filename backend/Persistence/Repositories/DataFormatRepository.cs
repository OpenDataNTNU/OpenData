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
    public class DataFormatRepository : BaseRepository, IDataFormatRepository
    {
        public DataFormatRepository(AppDbContext context) : base(context)
        {

        }

        public async Task<IEnumerable<DataFormat>> ListAsync()
        {
            return await _context.DataFormats.ToListAsync();
        }

        public async Task<DataFormat> GetByMimeTypeAsync(string mime) {
            return await _context.DataFormats.FirstAsync(x => x.MimeType == mime);
        }
        
        public async Task AddAsync(DataFormat tag) {
            await _context.DataFormats.AddAsync(tag);
        }
    }
}