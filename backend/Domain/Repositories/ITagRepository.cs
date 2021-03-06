using System.Collections.Generic;
using System.Threading.Tasks;
using System;

using OpenData.Domain.Models;

namespace OpenData.Domain.Repositories
{
    public interface ITagRepository
    {
         Task<IEnumerable<Tag>> ListAsync();
         Task<Tag> GetByNameAsync(string name);
         Task AddAsync(Tag tag);
    }
}