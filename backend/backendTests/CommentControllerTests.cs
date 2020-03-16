using System.Threading.Tasks;
using Xunit;

namespace OpenData.backend
{
    public class CommentControllerTests
    : IClassFixture<CustomWebApplicationFactory<Startup>>
    {

        private readonly CustomWebApplicationFactory<Startup> _factory;

        public CommentControllerTests(CustomWebApplicationFactory<Startup> factory)
        {
            _factory = factory;
        }

        /// <summary>
        /// Asserts correct status code for all HttpGet calls on the comment controller
        /// </summary>
        [Theory]
        [InlineData("/api/comment/metadata/{metadataUuid}")]
        [InlineData("/api/comment/experiencepost/{experiencePostUuid}")]
        [InlineData("/api/comment/childcomments/{commentUuid}")]
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
        /// Asserts correct content type for all HttpGet calls on the comment controller
        /// </summary>
        [Theory]
        [InlineData("/api/comment/metadata/{metadataUuid}")]
        [InlineData("/api/comment/experiencepost/{experiencePostUuid}")]
        [InlineData("/api/comment/childcomments/{commentUuid}")]
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
