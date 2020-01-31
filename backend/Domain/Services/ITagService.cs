using System.Collections.Generic;
using System.Threading.Tasks;
using System;

using OpenData.Domain.Services.Communication;
using OpenData.Domain.Models;

namespace OpenData.Domain.Services
{
    public interface ITagService
    {
         Task<IEnumerable<Tag>> ListAsync();
         Task<SaveTagResponse> SaveAsync(Tag tag);
    }
}