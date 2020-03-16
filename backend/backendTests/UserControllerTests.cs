using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Xunit;

namespace OpenData.backend
{
    public class UserControllerTests
    : IClassFixture<CustomWebApplicationFactory<Startup>>
    {

        private readonly CustomWebApplicationFactory<Startup> _factory;

        public UserControllerTests(CustomWebApplicationFactory<Startup> factory)
        {
            _factory = factory;
        }

        [Theory]
        [InlineData("/api/user")]
        public async Task Get_EndpointsReturnSuccessAndCorrectContentType(string url)
        {
            // Arrange
            var factory = _factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureTestServices(services =>
                {
                    services.AddAuthentication("Test").AddScheme<AuthenticationSchemeOptions, TestAuthHandler>("Test", options => { });
                });
            });
            var client = factory.CreateClient( new WebApplicationFactoryClientOptions { AllowAutoRedirect = false } );
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Test");

            // Act
            var getDefaultResponse = await client.GetAsync(url);

            // Assert
            getDefaultResponse.EnsureSuccessStatusCode(); // Status Code 200-299
            Assert.Equal("application/json; charset=utf-8",
                getDefaultResponse.Content.Headers.ContentType.ToString());
        }

    }
}
