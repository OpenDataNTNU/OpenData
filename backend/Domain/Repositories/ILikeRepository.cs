using System.Collections.Generic;
using System.Threading.Tasks;
using System;

using OpenData.Domain.Models;

namespace OpenData.Domain.Repositories
{
    public interface ILikeRepository
    {
    	public Task<Like> GetLikeByUserAndMetadata(User user, Metadata metadata);
    	public Task<int> GetLikeCount(Metadata metadata);
    	public Task DeleteLike(Like like);
        public Task AddAsync(Like like);
    }
}