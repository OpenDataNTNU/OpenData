using OpenData.Domain.Models;
using OpenData.Resources;
using System.Net.Http.Headers;
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

        [Fact]
        public async Task PutCommentsAndReplyToCommentTest() {
            var client = _factory.CreateDefaultClient();

            NewUserResource newUserResource = new NewUserResource();
            newUserResource.Mail = "ReplyToCommentTest@test.kommune.no";
            newUserResource.Password = "Comment@passw0rd";
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

            SaveMetadataTypeResource newMetadataTypeResource = new SaveMetadataTypeResource { CategoryUuid = category.Uuid, Name = "Super MetadataType" };
            var newMetadataTypeResponse = await client.PutAsync("api/metadatatype", ResponseSerializer.Serialize(newMetadataTypeResource));
            newMetadataTypeResponse.EnsureSuccessStatusCode();
            var metadataType = ResponseSerializer.Extract<MetadataTypeResource>(newMetadataTypeResponse);

            SaveMetadataResource saveMetadata = new SaveMetadataResource {
                Description = "Test",
                MetadataTypeUuid = metadataType.Uuid,
                MunicipalityName = user.MunicipalityName,
                ReleaseState = EReleaseState.Green
            };

            var newMetadataResponse = await client.PutAsync("api/metadata/", ResponseSerializer.Serialize(saveMetadata));
            newMetadataResponse.EnsureSuccessStatusCode();
            var metadata = ResponseSerializer.Extract<MetadataResource>(newMetadataResponse);

            var newComment = new NewCommentResource { Content = "Well hello there!"};
            var putCommentResponse = await client.PutAsync("api/comment/metadata/" + metadata.Uuid, ResponseSerializer.Serialize(newComment));
            putCommentResponse.EnsureSuccessStatusCode();
            var comment = ResponseSerializer.Extract<CommentResource>(putCommentResponse);
            Assert.Equal(newComment.Content, comment.Content);
            Assert.Equal(user.Mail, comment.UserMail);

            var newReplyComment = new NewCommentResource {
                Content = "Well, well, well hello there!"
            };

            var replyCommentResponse = await client.PutAsync("api/comment/reply/" + comment.Uuid, ResponseSerializer.Serialize(newReplyComment));
            replyCommentResponse.EnsureSuccessStatusCode();
            var replyComment = ResponseSerializer.Extract<CommentResource>(replyCommentResponse);
            Assert.Equal(comment.Uuid, replyComment.ParentCommentUuid);
            Assert.Equal(newReplyComment.Content, replyComment.Content);
            Assert.Equal(user.Mail, replyComment.UserMail);

            var newExperiencePost = new SaveExperiencePostResource {
                Title = "Big Test",
                Contents = "Test"
            };
            var newExperiencePostResponse = await client.PutAsync("api/metadata/" + metadata.Uuid + "/experience", ResponseSerializer.Serialize(newExperiencePost));
            newExperiencePostResponse.EnsureSuccessStatusCode();
            var experiencePost = ResponseSerializer.Extract<ExperiencePostResource>(newExperiencePostResponse);

            var newCommentExperiencePost = new NewCommentResource { Content = "Well hello there experience!" };
            var putCommentExperiencePost = await client.PutAsync("api/comment/experiencepost/" + experiencePost.Uuid, ResponseSerializer.Serialize(newCommentExperiencePost));
            putCommentExperiencePost.EnsureSuccessStatusCode();
            var commentExperiencePost = ResponseSerializer.Extract<CommentResource>(putCommentExperiencePost);
            Assert.Equal(newCommentExperiencePost.Content, commentExperiencePost.Content);
            Assert.Equal(user.Mail, commentExperiencePost.UserMail);
        }

    }
}
