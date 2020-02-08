using System.Threading.Tasks;

namespace OpenData.Domain.Repositories
{
    public interface IUnitOfWork
    {
         Task CompleteAsync();
    }
}