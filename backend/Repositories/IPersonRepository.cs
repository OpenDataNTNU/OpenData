using System.Collections.Generic;
using OpenDataBackend.Models;
 
namespace OpenDataBackend.Repositories
{
    public interface IPersonRepository
    {
        Person GetById(int id);
        List<Person> GetAll();
        int GetCount();
        void Remove();
        string Save(Person person);
    }
}