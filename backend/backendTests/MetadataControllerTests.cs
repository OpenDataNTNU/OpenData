using OpenData.Domain.Models;
using OpenData.Resources;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;

namespace OpenData.backend
{
    public class MetadataControllerTests
    : IClassFixture<CustomWebApplicationFactory<Startup>>
    {

        private readonly CustomWebApplicationFactory<Startup> _factory;

        public MetadataControllerTests(CustomWebApplicationFactory<Startup> factory)
        {
            _factory = factory;
        }

        /// <summary>
        /// Asserts correct status code for all HttpGet calls on the metadata controller
        /// </summary>
        [Theory]
        [InlineData("/api/metadata")]
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
        /// Asserts correct content type for all HttpGet calls on the metadata controller
        /// </summary>
        [Theory]
        [InlineData("/api/metadata")]
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

        //[Theory]
        //[InlineData("/api/metadata")]
        //public async Task Put_EndpointsReturnSuccess_CorrectContentType(string url)
        //{
        //    // Arrange

        //    var client = _factory.CreateDefaultClient();
        //    NewUserResource newUserResource = new NewUserResource();
        //    newUserResource.Mail = "PutMetadata@test.kommune.no";
        //    newUserResource.Password = "PutMetadata@passw0rd";
        //    newUserResource.UserType = UserType.Municipality;
        //    await client.PutAsync("api/user", new StringContent(JsonSerializer.Serialize(newUserResource), Encoding.UTF8, "application/json"));
        //    AuthUserResource loginResource = new AuthUserResource();
        //    loginResource.Mail = newUserResource.Mail;
        //    loginResource.Password = newUserResource.Password;
        //    var loginResponse = await client.PostAsync("/api/user/auth", new StringContent(JsonSerializer.Serialize(loginResource), Encoding.UTF8, "application/json"));
        //    Assert.NotNull(loginResponse.Content);
        //    var user = ExtractResponse.Extract<PrivateSafeUserResource>(loginResponse);
        //    Assert.Equal(loginResource.Mail, user.Mail);
        //    string token = user.Token;
        //    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        //    await client.GetAsync(url);
        //    SaveMetadataResource resource = new SaveMetadataResource();
        //    resource.Description = "";
        //    resource.FormatName = "";
        //    resource.MetadataTypeName = "";
        //    resource.MunicipalityName = "";
        //    resource.ReleaseState = EReleaseState.Red;
        //    resource.Url = "";

        //    // Act

        //    var response = await client.PutAsync(url, new StringContent(JsonSerializer.Serialize(resource), Encoding.UTF8, "application/json"));

        //    // Assert

        //    response.EnsureSuccessStatusCode(); // Status Code 200-299
        //    Assert.Equal("application/json; charset=utf-8",
        //        response.Content.Headers.ContentType.ToString());
        //}

    }
}
