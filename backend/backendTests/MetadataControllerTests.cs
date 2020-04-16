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
        /// Asserts correct status code and correct content type for HttpPut calls on the metadata controller (for new metadata and datasource) + Get metadata and like by uuid
        /// </summary>
        [Fact]
        public async Task Put_NewUnreleasedMetaData_NewDataSource_GetMetaData_GetMetaDataLike_EndpointsReturnSuccess_CorrectContentType()
        {
            // Arrange

            var client = _factory.CreateDefaultClient();
            NewUserResource newUserResource = new NewUserResource();
            newUserResource.Mail = "PutMet@test.kommune.no";
            newUserResource.Password = "PutMet@passw0rd";
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

            SaveMetadataResource metaDataResource = new SaveMetadataResource();
            metaDataResource.Description = "Test Description";
            metaDataResource.MunicipalityName = "Test";
            metaDataResource.ReleaseState = EReleaseState.Released;

            // Act

            var metaDataResponse = await client.PutAsync("/api/metadata", new StringContent(JsonSerializer.Serialize(metaDataResource), Encoding.UTF8, "application/json"));
            var metadata = ResponseSerializer.Extract<Metadata>(metaDataResponse);

            var metaDataGetResponse = await client.GetAsync("/api/metadata/" + metadata.Uuid);
            var metaDataLikeGetResponse = await client.GetAsync("/api/metadata/" + metadata.Uuid + "/like");

            Assert.Equal(user.MunicipalityName, metadata.MunicipalityName);

            NewDataFormatResource dataFormatResource = new NewDataFormatResource();
            dataFormatResource.Name = "Name of this dataformat";
            dataFormatResource.Description = "Describing this dataformat";
            dataFormatResource.DocumentationUrl = "this URL";
            dataFormatResource.MimeType = "this MimeType";
            var dataFormatResponse = await client.PutAsync("/api/dataformat", new StringContent(JsonSerializer.Serialize(dataFormatResource), Encoding.UTF8, "application/json"));
            var dataformat = ResponseSerializer.Extract<DataFormat>(dataFormatResponse);

            NewDataSourceResource dataSourceResource = new NewDataSourceResource();
            dataSourceResource.MetadataUuid = metadata.Uuid;
            dataSourceResource.Url = "This cool url";
            dataSourceResource.Description = "Some test source";
            dataSourceResource.StartDate = System.DateTime.MinValue;
            dataSourceResource.EndDate = System.DateTime.MaxValue;
            dataSourceResource.DataFormatMimeType = dataformat.MimeType;
            Assert.NotEqual(dataSourceResource.StartDate, dataSourceResource.EndDate);

            var dataSourceResponse = await client.PutAsync("/api/metadata/url", new StringContent(JsonSerializer.Serialize(dataSourceResource), Encoding.UTF8, "application/json"));

            // Assert

            metaDataResponse.EnsureSuccessStatusCode(); // Status Code 200-299
            Assert.Equal("application/json; charset=utf-8",
                metaDataResponse.Content.Headers.ContentType.ToString());

            metaDataGetResponse.EnsureSuccessStatusCode(); // Status Code 200-299
            Assert.Equal("application/json; charset=utf-8",
                metaDataGetResponse.Content.Headers.ContentType.ToString());

            dataSourceResponse.EnsureSuccessStatusCode(); // Status Code 200-299
            Assert.Equal("application/json; charset=utf-8",
                dataSourceResponse.Content.Headers.ContentType.ToString());

            //HttpRequestMessage httpRequest = new HttpRequestMessage(HttpMethod.Delete, "/api/metadata/url")
            //{
            //    Content = ResponseSerializer.Serialize(dataSourceResource)
            //};
            //HttpResponseMessage dataSourceDeleteResponse = await client.SendAsync(httpRequest);
            //dataSourceDeleteResponse.EnsureSuccessStatusCode(); // Status Code 200-299

        }

        /// <summary>
        /// Asserts correct status code and correct content type for all HttpGet calls on the metadata controller
        /// </summary>
        [Theory]
        [InlineData("/api/metadata")]
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
