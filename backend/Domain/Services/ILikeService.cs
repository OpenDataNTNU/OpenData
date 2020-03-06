using System.Collections.Generic;
using System.Threading.Tasks;
using System;

using OpenData.Domain.Services.Communication;
using OpenData.Domain.Models;

namespace OpenData.Domain.Services
{
    public interface ILikeService
    {
        Task<LikeReport> GetLikeReport(User user, Metadata metadata) ;

        Task<Like> GetLikeByUserAndMetadata(User user, Metadata metadata) ;

        Task DeleteLike(Like like) ;

        Task<SaveLikeResponse> SaveAsync(Like like);
    }
}