using OpenData.Domain.Models;
using OpenData.Resources;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
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

        /// <summary>
        /// Asserts correct status code for all HttpPut calls on the user controller
        /// </summary>
        [Theory]
        [InlineData("/api/user")]
        public async Task Put_TestNewMunicipalityUser_EndpointsReturnSuccess(string url)
        {
            // Arrange

            var client = _factory.CreateDefaultClient();
            NewUserResource resource = new NewUserResource();
            resource.Mail = "Put@test.kommune.no";
            resource.Password = "Put@passw0rd";
            resource.UserType = UserType.Municipality;

            // Act

            var response = await client.PutAsync(url, new StringContent(JsonSerializer.Serialize(resource), Encoding.UTF8, "application/json"));

            // Assert

            response.EnsureSuccessStatusCode(); // Status Code 200-299
            //var user = JsonSerializer.Deserialize<PrivateSafeUserResource>(await response.Content.ReadAsStringAsync());
            //SafeUserResource safeUserResource = new SafeUserResource();
            //Assert.Equal(UserType.Municipality, safeUserResource.UserType);
            //Assert.Equal("Bodø", user.MunicipalityName);
            // TODO: FIks kommune stuff
        }


        /// <summary>
        /// Asserts correct status code and correct content type for all HttpPost calls on the user controller
        /// </summary>
        [Theory]
        [InlineData("/api/user/auth")]
        public async Task Post_UserSignIn_EndpointsReturnSuccess_CorrectContentType(string url)
        {
            // Arrange

            var client = _factory.CreateDefaultClient();
            NewUserResource newUserResource = new NewUserResource();
            newUserResource.Mail = "Post@test.kommune.no";
            newUserResource.Password = "Post@passw0rd";
            await client.PutAsync("api/user", new StringContent(JsonSerializer.Serialize(newUserResource), Encoding.UTF8, "application/json"));
            AuthUserResource resource = new AuthUserResource();
            resource.Mail = "Post@test.kommune.no";
            resource.Password = "Post@passw0rd";

            // Act

            var response = await client.PostAsync(url, new StringContent(JsonSerializer.Serialize(resource), Encoding.UTF8, "application/json"));
            
            // Assert

            response.EnsureSuccessStatusCode(); // Status Code 200-299
            Assert.Equal("application/json; charset=utf-8",
                response.Content.Headers.ContentType.ToString());
            Assert.NotNull(response.Content);
            var user = ExtractResponse.Extract<PrivateSafeUserResource>(response);
            Assert.Equal(resource.Mail, user.Mail);
        }

        /// <summary>
        /// Asserts correct status code and correct content type for all HttpGet calls on the user controller
        /// </summary>
        [Theory]
        [InlineData("/api/user")]
        [InlineData("/api/user/profile")]
        public async Task Get_EndpointsReturnSuccess_CorrectContentType(string url)
        {
            // Arrange

            var client = _factory.CreateDefaultClient();
            NewUserResource newUserResource = new NewUserResource();
            newUserResource.Mail = "Get@test.kommune.no";
            newUserResource.Password = "Get@passw0rd";
            await client.PutAsync("api/user", new StringContent(JsonSerializer.Serialize(newUserResource), Encoding.UTF8, "application/json"));
            AuthUserResource loginResource = new AuthUserResource();
            loginResource.Mail = "Get@test.kommune.no";
            loginResource.Password = "Get@passw0rd";
            var loginResponse = await client.PostAsync("/api/user/auth", new StringContent(JsonSerializer.Serialize(loginResource), Encoding.UTF8, "application/json"));
            Assert.NotNull(loginResponse.Content);
            var user = ExtractResponse.Extract<PrivateSafeUserResource>(loginResponse);
            Assert.Equal(loginResource.Mail, user.Mail);
            string token = user.Token;
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Act

            var response = await client.GetAsync(url);

            // Assert

            response.EnsureSuccessStatusCode(); // Status Code 200-299
            Assert.Equal("application/json; charset=utf-8",
                response.Content.Headers.ContentType.ToString());
        }

    }
}
