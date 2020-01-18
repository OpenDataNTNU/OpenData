using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using OpenDataBackend.Attributes;
using OpenDataBackend.Models;
using OpenDataBackend.Repositories;
 
namespace OpenDataBackend.Controllers
{
    [ServiceFilter(typeof(AuthenticationFilterAttribute))]
    public class SecurePersonController : Controller
    {
        private readonly IPersonRepository _personRepository;
 
        public SecurePersonController(IPersonRepository personRepository)
        {
            _personRepository = personRepository;
        }
 
        [HttpGet("secure/person/all")]
        public List<Person> GetPersons()
        {
            return _personRepository.GetAll();
        }
    }
}