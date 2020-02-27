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

        Task<SaveLikeResponse> SaveAsync(Like like);
    }
}