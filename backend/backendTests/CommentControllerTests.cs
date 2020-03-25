using OpenData.Domain.Models;
using OpenData.Resources;
using System.Net.Http;
using System.Text;
using System.Text.Json;
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
        /// Asserts correct status code and correct content type for all HttpGet calls on the comment controller
        /// </summary>
        [Theory]
        [InlineData("/api/comment/metadata/{metadataUuid}")]
        [InlineData("/api/comment/experiencepost/{experiencePostUuid}")]
        [InlineData("/api/comment/childcomments/{commentUuid}")]
        public async Task Get_EndpointsReturnSuccess_CorrectContentType(string url)
        {
            // Arrange

            var client = _factory.CreateDefaultClient();

            // Act

            var response = await client.GetAsync(url);

            // Assert

            response.EnsureSuccessStatusCode(); // Status Code 200-299
            Assert.Equal("application/json; charset=utf-8",
                response.Content.Headers.ContentType.ToString());
        }

        /// <summary>
        /// Asserts correct status code and correct content type for all HttpPut calls on the comment controller
        /// </summary>
        //[Theory]
        //[InlineData("/api/comment/metadata/{metadataUuid}")]
        //public async Task Put_EndpointsReturnSuccess_CorrectContentType(string url)
        //{
        //    // Arrange

        //    var client = _factory.CreateDefaultClient();
        //    NewUserResource newUserResource = new NewUserResource();
        //    newUserResource.Mail = "Put@test.no";
        //    newUserResource.Password = "Put@passw0rd";
        //    newUserResource.UserType = UserType.Standard;
        //    NewCommentResource resource = new NewCommentResource();

        //    // Act

        //    await client.PutAsync("api/user", new StringContent(JsonSerializer.Serialize(newUserResource), Encoding.UTF8, "application/json"));
        //    AuthUserResource loginResource = new AuthUserResource();
        //    loginResource.Mail = newUserResource.Mail;
        //    loginResource.Password = newUserResource.Password;
        //    var loginResponse = await client.PostAsync("/api/user/auth", new StringContent(JsonSerializer.Serialize(loginResource), Encoding.UTF8, "application/json"));
        //    Assert.NotNull(loginResponse.Content);
        //    var user = ExtractResponse.Extract<PrivateSafeUserResource>(loginResponse);
        //    Assert.Equal(loginResource.Mail, user.Mail);
        //    var response = await client.PutAsync(url, new StringContent(JsonSerializer.Serialize(resource), Encoding.UTF8, "application/json"));

        //    // Assert

        //    response.EnsureSuccessStatusCode(); // Status Code 200-299
        //    Assert.Equal("application/json; charset=utf-8",
        //        response.Content.Headers.ContentType.ToString());
        //}


    }
}
