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
    public class MetadataCategoryControllerTests
    : IClassFixture<CustomWebApplicationFactory<Startup>>
    {

        private readonly CustomWebApplicationFactory<Startup> _factory;

        public MetadataCategoryControllerTests(CustomWebApplicationFactory<Startup> factory)
        {
            _factory = factory;
        }

        /// <summary>
        /// Asserts correct status code and correct content type for all HttpPut calls on the metadatacategory controller (includes one get by id)
        /// </summary>
        [Theory]
        [InlineData("/api/metadatacategory")]
        public async Task Put_NewMetadataCategory_GetById_EndpointsReturnSuccess_CorrectContentType(string url)
        {
            // Arrange

            var client = _factory.CreateDefaultClient();
            NewUserResource newUserResource = new NewUserResource();
            newUserResource.Mail = "PutMetCat@test.kommune.no";
            newUserResource.Password = "PutMetCat@passw0rd";
            newUserResource.UserType = UserType.Municipality;
            await client.PutAsync("api/user", ResponseSerializer.Serialize(newUserResource));

            AuthUserResource loginResource = new AuthUserResource();
            loginResource.Mail = newUserResource.Mail;
            loginResource.Password = newUserResource.Password;
            var loginResponse = await client.PostAsync("/api/user/auth", ResponseSerializer.Serialize(loginResource));
            Assert.NotNull(loginResponse.Content);
            var user = ResponseSerializer.Extract<PrivateSafeUserResource>(loginResponse);
            Assert.Equal(loginResource.Mail, user.Mail);
            string token = user.Token;
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            SaveMetadataCategoryResource resource = new SaveMetadataCategoryResource();
            resource.Name = "MetCatName";
            resource.ParentUuid = null;

            // Act

            var newCategoryResponse = await client.PutAsync(url, ResponseSerializer.Serialize(resource));
            var category = ResponseSerializer.Extract<MetadataCategory>(newCategoryResponse);
            var getCategoryResponse = await client.GetAsync(url + "/" + category.Uuid);

            // Assert

            newCategoryResponse.EnsureSuccessStatusCode(); // Status Code 200-299
            Assert.Equal("application/json; charset=utf-8",
                newCategoryResponse.Content.Headers.ContentType.ToString());

            getCategoryResponse.EnsureSuccessStatusCode(); // Status Code 200-299
            Assert.Equal("application/json; charset=utf-8",
                getCategoryResponse.Content.Headers.ContentType.ToString());
        }

        /// <summary>
        /// Asserts correct status code and correct content type for all HttpGet calls on the metadatacategory controller
        /// </summary>
        [Theory]
        [InlineData("/api/metadatacategory")]
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


    }
}
