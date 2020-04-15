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
    public class MetadataTypeControllerTests
    : IClassFixture<CustomWebApplicationFactory<Startup>>
    {

        private readonly CustomWebApplicationFactory<Startup> _factory;

        public MetadataTypeControllerTests(CustomWebApplicationFactory<Startup> factory)
        {
            _factory = factory;
        }

        /// <summary>
        /// Asserts correct status code and correct content type for all HttpPut calls on the metadatatype controller (includes 1 get test)
        /// </summary>
        [Theory]
        [InlineData("/api/metadatatype")]
        public async Task Put_NewMetadataTypeAndTag_GetByName_EndpointsReturnSuccess_CorrectContentType(string url)
        {
            // Arrange

            var client = _factory.CreateDefaultClient();
            NewUserResource newUserResource = new NewUserResource();
            newUserResource.Mail = "PutMetTyp@test.kommune.no";
            newUserResource.Password = "PutMetTyp@passw0rd";
            newUserResource.UserType = UserType.Municipality;
            await client.PutAsync("api/user", new StringContent(JsonSerializer.Serialize(newUserResource), Encoding.UTF8, "application/json"));

            AuthUserResource loginResource = new AuthUserResource();
            loginResource.Mail = newUserResource.Mail;
            loginResource.Password = newUserResource.Password;
            var loginResponse = await client.PostAsync("/api/user/auth", new StringContent(JsonSerializer.Serialize(loginResource), Encoding.UTF8, "application/json"));

            Assert.NotNull(loginResponse.Content);
            var user = ResponseSerializer.Extract<PrivateSafeUserResource>(loginResponse);
            Assert.Equal(loginResource.Mail, user.Mail);
            string token = user.Token;
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            MetadataType resource = new MetadataType();
            resource.Name = "Test";

            // Act

            var responseForMetadataType = await client.PutAsync(url, new StringContent(JsonSerializer.Serialize(resource), Encoding.UTF8, "application/json"));
            var responseForTag = await client.PutAsync(url + "/" + resource.Name + "/tag", new StringContent(JsonSerializer.Serialize(resource), Encoding.UTF8, "application/json"));
            var responseForGetByName = await client.GetAsync("/api/metadatatype/" + resource.Name);

            // Assert

            responseForMetadataType.EnsureSuccessStatusCode(); // Status Code 200-299
            Assert.Equal("application/json; charset=utf-8",
                responseForMetadataType.Content.Headers.ContentType.ToString());

            responseForTag.EnsureSuccessStatusCode(); // Status Code 200-299
            Assert.Equal("application/json; charset=utf-8",
                responseForTag.Content.Headers.ContentType.ToString());

            responseForGetByName.EnsureSuccessStatusCode(); // Status Code 200-299
            Assert.Equal("application/json; charset=utf-8",
                responseForGetByName.Content.Headers.ContentType.ToString());
        }

        /// <summary>
        /// Asserts correct status code and correct content type for all HttpGet calls on the metadatatype controller
        /// </summary>
        [Theory]
        [InlineData("/api/metadatatype")]
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

        [Fact]
        public async Task Get_FetchDescriptionsForMetadataType_CorrectContentType()
        {
            var client = _factory.CreateDefaultClient();


            //SaveMetadataTypeResource metadataTypeResource = new SaveMetadataTypeResource { CategoryUuid = "", Name = "Fugler" };
            //await client.PutAsync("api/metadataType" , ResponseSerializer.Serialize(metadataTypeResource));

        }
    }
}
