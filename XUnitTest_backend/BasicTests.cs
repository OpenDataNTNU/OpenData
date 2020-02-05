using Microsoft.AspNetCore.Mvc.Testing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace OpenData
{
    public class BasicTests
    : IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly WebApplicationFactory<Startup> _factory;

        public BasicTests(WebApplicationFactory<Startup> factory)
        {
            _factory = factory;
        }

        [Theory]
        [InlineData("/api/municipality")]
        public async Task Get_EndpointsReturnSuccessAndCorrectContentType(string url)
        {
            Console.WriteLine("blablabla");
            // Arrange
            var client = _factory.CreateClient();

            // Act
            var response = await client.GetAsync(url);

            // Assert
            response.EnsureSuccessStatusCode(); // Status Code 200-299
            Assert.Equal("text/html; charset=utf-8",
                response.Content.Headers.ContentType.ToString());
        }

        [Theory]
        [InlineData(69)]
        public void isTestPassed(int num)
        {
            Assert.Equal(69, num);
        }

        [Theory]
        [InlineData(420)]
        public void isTestNotPassed(int num)
        {
            Assert.Equal(69, num);
        }

    }
}
