using System.Collections.Generic;
using System.Threading.Tasks;
using System;

using OpenData.Domain.Models;
using OpenData.Domain.Repositories;
using OpenData.Domain.Services;
using OpenData.Domain.Services.Communication;

namespace OpenData.Services
{
    public class LikeService : ILikeService
    {
    	private readonly ILikeRepository _likeRepository;

    	public LikeService(ILikeRepository likeRepository) 
    	{
    		_likeRepository = likeRepository;
    	}

        public async Task<LikeReport> GetLikeReport(User user, Metadata metadata) {
            var likeCount = await _likeRepository.GetLikeCount(metadata);
            var liked = false;
            if(user != null) {
                var like =  await _likeRepository.GetLikeByUserAndMetadata(user, metadata);
                if(like != null) {
                    liked = true;
                }
            }

            return new LikeReport { LikeCount = likeCount, Liked = liked};
        }

        public async Task<SaveLikeResponse> SaveAsync(Like like) {
            try
            {
                await _likeRepository.AddAsync(like);
                
                return new SaveLikeResponse(like);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new SaveLikeResponse($"An error occurred when saving the category: {ex.Message}");
            }
        }
    }
}