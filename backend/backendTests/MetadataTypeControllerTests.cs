using System.Threading.Tasks;
using Xunit;

namespace OpenData.backend
{
    public class MetadataTypeControllerTests
    : IClassFixture<CustomWebApplicationFactory<Startup>>
    {

        private readonly CustomWebApplicationFactory<Startup> _factory;

        public MetadataTypeControllerTests(CustomWebApplicationFactory<Startup> factory)
        {
            _factory = factory;
        }

        [Theory]
        [InlineData("/api/metadatatype")]
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
