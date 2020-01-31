using System.Collections.Generic;
using System.Threading.Tasks;
using System;

using OpenData.Domain.Models;
using OpenData.Domain.Repositories;
using OpenData.Domain.Services;
using OpenData.Domain.Services.Communication;

namespace OpenData.Services
{
    public class TagService : ITagService
    {
    	private readonly ITagRepository _tagRepository;

    	public TagService(ITagRepository tagRepository) 
    	{
    		_tagRepository = tagRepository;
    	}

        public async Task<IEnumerable<Tag>> ListAsync()
        {
        	return await _tagRepository.ListAsync();
        }

        public async Task<Tag> GetByNameAsync(string name) {
            return await _tagRepository.GetByNameAsync(name);
        }
        
        public async Task<SaveTagResponse> SaveAsync(Tag tag) {
            try
            {
                await _tagRepository.AddAsync(tag);
                
                return new SaveTagResponse(tag);
            }
            catch (Exception ex)
            {
                // Do some logging stuff
                return new SaveTagResponse($"An error occurred when saving the category: {ex.Message}");
            }
        }
    }
}