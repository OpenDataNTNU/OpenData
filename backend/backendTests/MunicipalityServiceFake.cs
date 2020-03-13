using Microsoft.AspNetCore.Mvc;
using OpenData.Controllers;
using OpenData.Domain.Models;
using OpenData.Domain.Services;
using System.Threading.Tasks;
using Xunit;
using System.Collections.Generic;
using System.Linq;
using System;
using OpenData.Domain.Repositories;
using Moq;

namespace OpenData.backend

{
    public class MunicipalityServiceFake
    : IMunicipalityService
    {
        private readonly IMunicipalityRepository _municipalityRepository;

        private readonly List<Municipality> _municipality;
        
        public MunicipalityServiceFake()
        {
            _municipalityRepository = new Mock<IMunicipalityRepository>().Object;
            _municipality = new List<Municipality>()
            {
                new Municipality() { Name = "Bærum",
                    MailDomain = "baerum.kommune.no", ShieldFileName="404.png" },
                new Municipality() { Name = "Asker",
                    MailDomain = "asker.kommune.no", ShieldFileName="404.png" },
                new Municipality() { Name = "Bodø",
                    MailDomain = "bodo.kommune.no", ShieldFileName="404.png" }
            };
        }

        public async Task<Municipality> GetMunicipalityByDomainAsync(string domain)
        {
            return await _municipalityRepository.GetMunicipalityByDomainAsync(domain);
        }

        public async Task<IEnumerable<Municipality>> ListAsync()
        {
            return await _municipalityRepository.ListAsync();
        }

        public async Task<Municipality> FetchByName(string name)
        {
            return await _municipalityRepository.FetchByName(name);
        }
    }
}
