using OpenData.Domain.Models;
using OpenData.Resources;
using System;
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


            var newCategory = new SaveMetadataCategoryResource { ParentUuid = null, Name = "Test Category" };
            var newCategoryResponse = await client.PutAsync("api/metadatacategory", ResponseSerializer.Serialize(newCategory));
            newCategoryResponse.EnsureSuccessStatusCode();

            var category = ResponseSerializer.Extract<MetadataCategory>(newCategoryResponse);

            SaveMetadataTypeResource newMetadataTypeResource = new SaveMetadataTypeResource
            {
                CategoryUuid = category.Uuid,
                Name = "Test"
            };

            // Act

            var metadataTypeResponse = await client.PutAsync(url, ResponseSerializer.Serialize(newMetadataTypeResource));
            var metadataType = ResponseSerializer.Extract<MetadataTypeResource>(metadataTypeResponse);

            //var responseForTag = await client.PutAsync(url + "/" + resource.Name + "/tag", ResponseSerializer.Serialize(resource));
            var responseForGetByName = await client.GetAsync(url + "/" + metadataType.Uuid);

            // Assert

            metadataTypeResponse.EnsureSuccessStatusCode(); // Status Code 200-299
            Assert.Equal("application/json; charset=utf-8",
                metadataTypeResponse.Content.Headers.ContentType.ToString());

            /*
            responseForTag.EnsureSuccessStatusCode(); // Status Code 200-299
            Assert.Equal("application/json; charset=utf-8",
                responseForTag.Content.Headers.ContentType.ToString());
            */
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
        public async Task FetchDescriptions()
        {

            var client = _factory.CreateDefaultClient();

            NewUserResource newUserResource = new NewUserResource();
            newUserResource.Mail = "MetadataType@test.kommune.no";
            newUserResource.Password = "MetadataType@passw0rd";
            newUserResource.UserType = UserType.Municipality;
            await client.PutAsync("api/user", ResponseSerializer.Serialize(newUserResource));

            AuthUserResource loginResource = new AuthUserResource();
            loginResource.Mail = newUserResource.Mail;
            loginResource.Password = newUserResource.Password;
            var loginResponse = client.PostAsync("/api/user/auth", ResponseSerializer.Serialize(loginResource)).Result;

            Assert.NotNull(loginResponse.Content);
            var user = ResponseSerializer.Extract<PrivateSafeUserResource>(loginResponse);
            Assert.Equal(loginResource.Mail, user.Mail);
            string token = user.Token;
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);


            var newCategory = new SaveMetadataCategoryResource { ParentUuid = null, Name = "Super Category" };
            var newCategoryResponse = await client.PutAsync("api/metadatacategory", ResponseSerializer.Serialize(newCategory));
            newCategoryResponse.EnsureSuccessStatusCode();

            var category = ResponseSerializer.Extract<MetadataCategory>(newCategoryResponse);

            SaveMetadataTypeResource newMetadataTypeResource = new SaveMetadataTypeResource { CategoryUuid = category.Uuid, Name = "Fugler" };
            var newMetadataTypeResponse = await client.PutAsync("api/metadatatype" , ResponseSerializer.Serialize(newMetadataTypeResource));
            newMetadataTypeResponse.EnsureSuccessStatusCode();

        }
    }
}
