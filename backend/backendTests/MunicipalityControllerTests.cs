using System.Threading.Tasks;
using Xunit;

namespace OpenData.backend
{
    public class MunicipalityControllerTests
    : IClassFixture<CustomWebApplicationFactory<Startup>>
    {

        private readonly CustomWebApplicationFactory<Startup> _factory;

        public MunicipalityControllerTests(CustomWebApplicationFactory<Startup> factory)
        {
            _factory = factory;
        }

        /// <summary>
        /// Asserts correct status code for all HttpGet calls on the municipality controller
        /// </summary>
        [Theory]
        [InlineData("/api/municipality")]
        [InlineData("/api/municipality/Test")]
        public async Task Get_EndpointsReturnSuccess(string url)
        {
            // Arrange

            var client = _factory.CreateDefaultClient();

            // Act

            var response = await client.GetAsync(url);

            // Assert

            response.EnsureSuccessStatusCode(); // Status Code 200-299
        }

        /// <summary>
        /// Asserts correct content type for all HttpGet calls on the municipality controller
        /// </summary>
        [Theory]
        [InlineData("/api/municipality")]
        [InlineData("/api/municipality/Test")]
        public async Task Get_CorrectContentType(string url)
        {
            // Arrange

            var client = _factory.CreateDefaultClient();

            // Act

            var response = await client.GetAsync(url);

            // Assert

            Assert.Equal("application/json; charset=utf-8",
                response.Content.Headers.ContentType.ToString());
        }

    }
}
