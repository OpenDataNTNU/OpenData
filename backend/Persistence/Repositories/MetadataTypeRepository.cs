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

        public async Task<MetadataType> GetByNameAsync(string name) {
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
                .Where(m => m.Description.Content.Contains(searchParams.Keywords, StringComparison.OrdinalIgnoreCase))
                .ToListAsync();
        }

        public async Task AddNewDescriptionAsync(MetadataTypeDescription metadataTypeDescription)
        {
            await _context.MetadataTypeDescriptions.AddAsync(metadataTypeDescription);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<MetadataTypeDescription>> ListDescriptionsAsync(Guid metadataTypeUuid)
        {
            return await _context.MetadataTypeDescriptions
                .Where(mtd => mtd.MetadataTypeUuid == metadataTypeUuid)
                .ToListAsync();
        }

        private async Task TallyVotes(Guid metadataUuid)
        {
            /*await _context.MetadataTypeDescriptions
                .Where(mtd => mtd.MetadataTypeUuid == metadataUuid)
                .Include(d => d.Votes)
                .OrderBy(mt => mt.Description.Votes.Count())
                .ToListAsync();*/
        }

        public async Task VoteOnDescriptionAsync(MetadataTypeDescriptionVote vote, Guid metadataUuid)
        {
            await _context.MetadataTypeDescriptionVotes.AddAsync(vote);
        }

        public async Task RemoveVoteOnDescriptionAsync(string userMail, Guid descUuid, Guid metadataUuid)
        {
            MetadataTypeDescriptionVote vote = new MetadataTypeDescriptionVote();
            vote.UserMail = userMail;
            vote.MetadataTypeDescriptionUuid = descUuid;

            _context.MetadataTypeDescriptionVotes.Remove(vote);
        }
    }
}