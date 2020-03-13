using OpenData.Domain.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace OpenData.backend
{
    public class MunicipalityControllerTests
    : IClassFixture<CustomWebApplicationFactory<Startup>>
    {

        private readonly CustomWebApplicationFactory<Startup> _factory;
        private readonly List<Municipality> _municipality;
        private readonly Random _random;

        public MunicipalityControllerTests(CustomWebApplicationFactory<Startup> factory)
        {
            _factory = factory;
            _municipality = new List<Municipality>()
            {
                new Municipality() { Name = "Bærum",
                    MailDomain = "baerum.kommune.no", ShieldFileName="404.png" },
                new Municipality() { Name = "Asker",
                    MailDomain = "asker.kommune.no", ShieldFileName="404.png" },
                new Municipality() { Name = "Bodø",
                    MailDomain = "bodo.kommune.no", ShieldFileName="404.png" }
            };
            _random = new Random();
        }

        [Theory]
        [InlineData("/api/municipality")]
        public async Task Get_EndpointsReturnSuccessAndCorrectContentType(string url)
        {
            // Arrange
            var client = _factory.CreateDefaultClient();

            // Act
            var getDefaultResponse = await client.GetAsync(url);
            var getByNameResponse = await client.GetAsync(url + "/" + _municipality[_random.Next(0,
                _municipality.Count)].Name);

            // Assert
            getDefaultResponse.EnsureSuccessStatusCode(); // Status Code 200-299
            getByNameResponse.EnsureSuccessStatusCode(); // Status Code 200-299
            Assert.Equal("application/json; charset=utf-8",
                getDefaultResponse.Content.Headers.ContentType.ToString());
            Assert.Equal("application/json; charset=utf-8",
                getByNameResponse.Content.Headers.ContentType.ToString());
        }

    }
}
