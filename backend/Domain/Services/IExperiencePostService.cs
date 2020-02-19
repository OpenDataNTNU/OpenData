using System.Collections.Generic;
using System.Threading.Tasks;
using System;

using OpenData.Domain.Services.Communication;
using OpenData.Domain.Models;

namespace OpenData.Domain.Services
{
    public interface IExperiencePostService
    {
         Task<IEnumerable<ExperiencePost>> ListAsync();
         Task<ExperiencePost> GetByUuidAsync(Guid uuid);
         Task<SaveExperiencePostResponse> SaveAsync(ExperiencePost metadata);
    }
}