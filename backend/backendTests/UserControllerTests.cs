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
        /// Asserts unauthorized results for all non-authorized HttpGet calls on the user controller
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
        /// Asserts user type to be equal to a municipality user, correct status code and correct content type for all HttpPut calls on the user controller
        /// </summary>
        [Theory]
        [InlineData("/api/user")]
        public async Task Put_NewMunicipalityUser_EndpointsReturnSuccess_CorrectContentType(string url)
        {
            // Arrange

            var client = _factory.CreateDefaultClient();
            NewUserResource resource = new NewUserResource();
            resource.Mail = "Put@test.kommune.no";
            resource.Password = "Put@passw0rd";
            resource.UserType = UserType.Municipality;

            // Act

            var response = await client.PutAsync(url, new StringContent(JsonSerializer.Serialize(resource), Encoding.UTF8, "application/json"));
            AuthUserResource loginResource = new AuthUserResource();
            loginResource.Mail = resource.Mail;
            loginResource.Password = resource.Password;
            var loginResponse = await client.PostAsync("/api/user/auth", new StringContent(JsonSerializer.Serialize(loginResource), Encoding.UTF8, "application/json"));
            Assert.NotNull(loginResponse.Content);
            var user = ExtractResponse.Extract<PrivateSafeUserResource>(loginResponse);
            Assert.Equal(loginResource.Mail, user.Mail);

            // Assert

            Assert.NotEqual(UserType.Standard, user.UserType);
            Assert.NotEqual(UserType.Admin, user.UserType);
            Assert.Equal(UserType.Municipality, user.UserType);
            Assert.Equal("Test", user.MunicipalityName);
            response.EnsureSuccessStatusCode(); // Status Code 200-299
            Assert.Equal("application/json; charset=utf-8",
                response.Content.Headers.ContentType.ToString());
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

            // Act

            await client.PutAsync("api/user", new StringContent(JsonSerializer.Serialize(newUserResource), Encoding.UTF8, "application/json"));
            AuthUserResource resource = new AuthUserResource();
            resource.Mail = newUserResource.Mail;
            resource.Password = newUserResource.Password;
            var response = await client.PostAsync(url, new StringContent(JsonSerializer.Serialize(resource), Encoding.UTF8, "application/json"));
            Assert.NotNull(response.Content);
            var user = ExtractResponse.Extract<PrivateSafeUserResource>(response);
            Assert.Equal(resource.Mail, user.Mail);

            // Assert

            response.EnsureSuccessStatusCode(); // Status Code 200-299
            Assert.Equal("application/json; charset=utf-8",
                response.Content.Headers.ContentType.ToString());
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

            // Act

            await client.PutAsync("api/user", new StringContent(JsonSerializer.Serialize(newUserResource), Encoding.UTF8, "application/json"));
            AuthUserResource loginResource = new AuthUserResource();
            loginResource.Mail = newUserResource.Mail;
            loginResource.Password = newUserResource.Password;
            var loginResponse = await client.PostAsync("/api/user/auth", new StringContent(JsonSerializer.Serialize(loginResource), Encoding.UTF8, "application/json"));
            Assert.NotNull(loginResponse.Content);
            var user = ExtractResponse.Extract<PrivateSafeUserResource>(loginResponse);
            Assert.Equal(loginResource.Mail, user.Mail);
            string token = user.Token;
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await client.GetAsync(url);

            // Assert

            response.EnsureSuccessStatusCode(); // Status Code 200-299
            Assert.Equal("application/json; charset=utf-8",
                response.Content.Headers.ContentType.ToString());
        }

    }
}
