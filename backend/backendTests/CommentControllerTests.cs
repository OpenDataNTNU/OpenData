using System;
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

        [Theory]
        [InlineData("/api/comment")]
        public async Task Get_EndpointsReturnSuccessAndCorrectContentType(string url)
        {
            // Arrange
            var client = _factory.CreateDefaultClient();

            // Act
            var getDefaultResponse = await client.GetAsync(url);
            var getByMetadataUuidResponse = await client.GetAsync(url + "/metadata/" + Guid.NewGuid());
            var getByExperiencePostUuidResponse = await client.GetAsync(url + "/experiencepost/" + Guid.NewGuid());
            var getByCommentUuidResponse = await client.GetAsync(url + "/childcomments/" + Guid.NewGuid());

            // Assert
            getByMetadataUuidResponse.EnsureSuccessStatusCode(); // Status Code 200-299
            getByExperiencePostUuidResponse.EnsureSuccessStatusCode(); // Status Code 200-299
            getByCommentUuidResponse.EnsureSuccessStatusCode(); // Status Code 200-299
            Assert.Equal("application/json; charset=utf-8",
                getByMetadataUuidResponse.Content.Headers.ContentType.ToString());
            Assert.Equal("application/json; charset=utf-8",
                getByExperiencePostUuidResponse.Content.Headers.ContentType.ToString());
            Assert.Equal("application/json; charset=utf-8",
                getByCommentUuidResponse.Content.Headers.ContentType.ToString());
        }

    }
}
