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
    public class LikeRepository : BaseRepository, ILikeRepository
    {
        public LikeRepository(AppDbContext context) : base(context)
        {

        }

        public async Task<Like> GetLikeByUserAndMetadata(User user, Metadata metadata) {
            return await _context.Likes.FirstAsync(x => x.LikeUser == user && x.Metadata == metadata);
        }

        public async Task<int> GetLikeCount(Metadata metadata) {
            return await _context.Likes.CountAsync(x => x.Metadata == metadata);
        }

        public async Task DeleteLike(Like like) {
            _context.Likes.Remove(like);
        }

        public async Task AddAsync(Like like) {
            await _context.Likes.AddAsync(like);
        }
    }
}