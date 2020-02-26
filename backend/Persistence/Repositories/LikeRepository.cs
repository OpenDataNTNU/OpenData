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

        public async Task GetLikeByUser(User user) {
            await _context.Likes.FirstAsync(x => x.LikeUser == user);
        }

        public async Task AddAsync(Like like) {
            await _context.Likes.AddAsync(metadata);
        }
    }
}