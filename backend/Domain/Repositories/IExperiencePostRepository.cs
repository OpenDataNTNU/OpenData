using System.Collections.Generic;
using System.Threading.Tasks;
using System;

using OpenData.Domain.Models;

namespace OpenData.Domain.Repositories
{
    public interface IExperiencePostRepository
    {
         Task<IEnumerable<ExperiencePost>> GetListAsync();
         Task<ExperiencePost> GetByUuidAsync(Guid uuid);
         Task AddAsync(ExperiencePost experiencePost);
    }
}