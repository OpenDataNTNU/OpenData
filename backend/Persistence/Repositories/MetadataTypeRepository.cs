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

        public async Task<MetadataType> GetByUuidAsync(Guid uuid) {
            var metadataType = await _context.MetadataTypes
                .Include(p => p.Tags)
                .Include(p => p.MetadataList)
                .ThenInclude(p => p.DataSource)
                .ThenInclude(p => p.DataFormat)
                .FirstAsync(x => x.Uuid == uuid);
            metadataType.Description = await GetMetadataTypeDescription(metadataType.Uuid);
            return metadataType;
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
                .Where(m => m.Descriptions
                    .OrderByDescending(d => d.Published)
                    .OrderByDescending(d => d.Votes.Count())
                    .First().Content.Contains(searchParams.Keywords, StringComparison.OrdinalIgnoreCase)
                 )
                .ToListAsync();
        }

        public async Task AddNewDescriptionAsync(MetadataTypeDescription metadataTypeDescription)
        {
            await _context.MetadataTypeDescriptions.AddAsync(metadataTypeDescription);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<MetadataTypeDescription>> ListDescriptionsAsync(Guid metadataTypeUuid, string userMail)
        {
            return await _context.MetadataTypeDescriptions
                .Where(d => d.MetadataTypeUuid == metadataTypeUuid)
                .Select(d => new MetadataTypeDescription
                {
                    Uuid = d.Uuid,
                    Content = d.Content,
                    Author = d.Author,
                    Published = d.Published,
                    HasVoted = d.Votes.Any(v => v.UserMail == userMail),
                    Edited = d.Edited,
                    VoteCount = d.Votes.Count()
                })
                .OrderByDescending(d => d.Published)
                .OrderByDescending(d => d.VoteCount)
                .ToListAsync();
        }

        private async Task<MetadataTypeDescription> GetMetadataTypeDescription(Guid metadataTypeUuid)
        {
            return await _context.MetadataTypeDescriptions
                .Where(d => d.MetadataTypeUuid == metadataTypeUuid)
                .Select(d => new MetadataTypeDescription
                {
                    Uuid = d.Uuid,
                    Content = d.Content,
                    Author = d.Author,
                    Published = d.Published,
                    Edited = d.Edited,
                    VoteCount = d.Votes.Count()
                })
                .OrderByDescending(d => d.Published)
                .OrderByDescending(d => d.VoteCount)
                .FirstOrDefaultAsync();
        }

        public async Task VoteOnDescriptionAsync(MetadataTypeDescriptionVote vote, Guid metadataUuid)
        {
            await _context.MetadataTypeDescriptionVotes.AddAsync(vote);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveVoteOnDescriptionAsync(string userMail, Guid descUuid, Guid metadataUuid)
        {
            MetadataTypeDescriptionVote vote = new MetadataTypeDescriptionVote();
            vote.UserMail = userMail;
            vote.MetadataTypeDescriptionUuid = descUuid;

            _context.MetadataTypeDescriptionVotes.Remove(vote);
            await _context.SaveChangesAsync();
        }
    }
}
