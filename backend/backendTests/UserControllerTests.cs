using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
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

        //[Theory]
        //[InlineData("/api/user")]
        //public async Task Get_EndpointsReturnSuccessAndCorrectContentType(string url)
        //{
        //    // Arrange
        //    var client = _factory.WithWebHostBuilder(builder =>
        //    {
        //        builder.ConfigureTestServices(services =>
        //        {
        //            services.AddAuthentication("Test")
        //                .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(
        //                    "Test", options => { });
        //        });
        //    })
        //    .CreateClient(new WebApplicationFactoryClientOptions
        //    {
        //        AllowAutoRedirect = false,
        //    });

        //    client.DefaultRequestHeaders.Authorization =
        //        new AuthenticationHeaderValue("Test");

        //    // Act
        //    var getDefaultResponse = await client.GetAsync(url);

        //    // Assert
        //    getDefaultResponse.EnsureSuccessStatusCode(); // Status Code 200-299
        //    Assert.Equal("application/json; charset=utf-8",
        //        getDefaultResponse.Content.Headers.ContentType.ToString());
        //}

        /// <summary>
        /// Asserts unauthorized results for all HttpGet calls on the user controller
        /// </summary>
        [Theory]
        [InlineData("/api/user")]
        [InlineData("/api/user/profile")]
        public async Task Get_InvalidScope_ReturnsUnauthorizedResult(string url)
        {
            // Arrange

            var client = _factory.CreateDefaultClient();
            var expected = HttpStatusCode.Unauthorized;

            // Act

            var response = await client.GetAsync(url);

            // Assert

            Assert.Equal(expected, response.StatusCode);
        }

    }
}
