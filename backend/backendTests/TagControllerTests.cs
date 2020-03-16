﻿using System.Threading.Tasks;
using Xunit;

namespace OpenData.backend
{
    public class TagControllerTests
    : IClassFixture<CustomWebApplicationFactory<Startup>>
    {

        private readonly CustomWebApplicationFactory<Startup> _factory;

        public TagControllerTests(CustomWebApplicationFactory<Startup> factory)
        {
            _factory = factory;
        }

        [Theory]
        [InlineData("/api/tag")]
        public async Task Get_EndpointsReturnSuccessAndCorrectContentType(string url)
        {
            // Arrange
            var client = _factory.CreateDefaultClient();

            // Act
            var getDefaultResponse = await client.GetAsync(url);

            // Assert
            getDefaultResponse.EnsureSuccessStatusCode(); // Status Code 200-299
            Assert.Equal("application/json; charset=utf-8",
                getDefaultResponse.Content.Headers.ContentType.ToString());
        }

    }
}
