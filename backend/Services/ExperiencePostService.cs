using System.Collections.Generic;
using System.Threading.Tasks;
using System;

using OpenData.Domain.Models;
using OpenData.Domain.Repositories;
using OpenData.Domain.Services;
using OpenData.Domain.Services.Communication;

namespace OpenData.Services
{
    public class ExperiencePostService : IExperiencePostService
    {
    	private readonly IExperiencePostRepository _experiencePostRepository;

    	public ExperiencePostService(IExperiencePostRepository experiencePostRepository) 
    	{
    		_experiencePostRepository = experiencePostRepository;
    	}

        public async Task<IEnumerable<ExperiencePost>> ListAsync()
        {
        	return await _experiencePostRepository.GetListAsync();
        }

        public async Task<ExperiencePost> GetByUuidAsync(Guid uuid) {
            return await _experiencePostRepository.GetByUuidAsync(uuid);
        }

        public async Task<SaveExperiencePostResponse> SaveAsync(ExperiencePost post) {
            try
            {
                await _experiencePostRepository.AddAsync(post);
                
                return new SaveExperiencePostResponse(post);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new SaveExperiencePostResponse($"An error occurred when saving the experience post: {ex.Message}");
            }
        }
    }
}