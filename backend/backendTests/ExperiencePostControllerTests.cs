using System.Threading.Tasks;
using Xunit;

namespace OpenData.backend
{
    public class ExperiencePostControllerTests
    : IClassFixture<CustomWebApplicationFactory<Startup>>
    {

        private readonly CustomWebApplicationFactory<Startup> _factory;

        public ExperiencePostControllerTests(CustomWebApplicationFactory<Startup> factory)
        {
            _factory = factory;
        }

        /// <summary>
        /// Asserts correct status code and correct content type for HttpPut calls on the experiencepost controller (for new tag) + Get experiencepost by uuid
        /// </summary>
        //[Theory]
        //[InlineData("/api/experiencepost")]
        //public async Task Put_AttachTag_GetExperiencePost_EndpointsReturnSuccess_CorrectContentType(string url)
        //{
        //    // Arrange

        //    var client = _factory.CreateDefaultClient();
        //    NewUserResource newUserResource = new NewUserResource();
        //    newUserResource.Mail = "PutExpTag@test.kommune.no";
        //    newUserResource.Password = "PutExpTag@passw0rd";
        //    newUserResource.UserType = UserType.Municipality;
        //    await client.PutAsync("api/user", new StringContent(JsonSerializer.Serialize(newUserResource), Encoding.UTF8, "application/json"));

        //    AuthUserResource loginResource = new AuthUserResource();
        //    loginResource.Mail = newUserResource.Mail;
        //    loginResource.Password = newUserResource.Password;
        //    var loginResponse = await client.PostAsync("/api/user/auth", new StringContent(JsonSerializer.Serialize(loginResource), Encoding.UTF8, "application/json"));
        //    Assert.NotNull(loginResponse.Content);
        //    var user = ResponseSerializer.Extract<PrivateSafeUserResource>(loginResponse);
        //    Assert.Equal(loginResource.Mail, user.Mail);
        //    string token = user.Token;
        //    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        //    SaveMetadataResource metaDataResource = new SaveMetadataResource();
        //    metaDataResource.Description = "Test Description";
        //    metaDataResource.MunicipalityName = "Test";
        //    metaDataResource.ReleaseState = EReleaseState.Released;
        //    var metaDataResponse = await client.PutAsync("/api/metadata", new StringContent(JsonSerializer.Serialize(metaDataResource), Encoding.UTF8, "application/json"));
        //    var metadata = ResponseSerializer.Extract<Metadata>(metaDataResponse);
        //    Assert.Equal(user.MunicipalityName, metadata.MunicipalityName);

        //    SaveExperiencePostResource experiencePostResource = new SaveExperiencePostResource();
        //    experiencePostResource.Title = "Some title";
        //    experiencePostResource.Contents = "lorem ipsum";
        //    var experienceResponse = await client.PutAsync("/api/metadata/" + metadata.Uuid + "/experience", new StringContent(JsonSerializer.Serialize(experiencePostResource), Encoding.UTF8, "application/json"));
        //    var experiencepost = ResponseSerializer.Extract<ExperiencePostResource>(experienceResponse);

        //    Tag tagResource = new Tag();
        //    tagResource.Name = "Tagname";
        //    var tagResponse = await client.PutAsync("/api/tag" , new StringContent(JsonSerializer.Serialize(tagResource), Encoding.UTF8, "application/json"));
        //    var tag = ResponseSerializer.Extract<Tag>(tagResponse);

        //    // Act

        //    var experiencepostTagResponse = await client.PutAsync(url + "/" + experiencepost.Uuid + "/tag", new StringContent(JsonSerializer.Serialize(tag), Encoding.UTF8, "application/json"));
        //    var experiencepostGetResponse = await client.GetAsync(url + "/" + experiencepost.Uuid);

        //    // Assert

        //    experiencepostTagResponse.EnsureSuccessStatusCode(); // Status Code 200-299
        //    Assert.Equal("application/json; charset=utf-8",
        //        experiencepostTagResponse.Content.Headers.ContentType.ToString());

        //    experiencepostGetResponse.EnsureSuccessStatusCode(); // Status Code 200-299
        //    Assert.Equal("application/json; charset=utf-8",
        //        experiencepostGetResponse.Content.Headers.ContentType.ToString());

        //}

        /// <summary>
        /// Asserts correct status code and correct content type for all HttpGet calls on the experiencepost controller
        /// </summary>
        [Theory]
        [InlineData("/api/experiencepost")]
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
