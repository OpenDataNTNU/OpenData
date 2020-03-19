using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using OpenData.Controllers;
using OpenData.Domain.Models;
using OpenData.Extensions;
using OpenData.Resources;
using System.Collections.Generic;
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

        Stack<int> stack;
        private readonly CustomWebApplicationFactory<Startup> _factory;

        public UserControllerTests(CustomWebApplicationFactory<Startup> factory)
        {
            stack = new Stack<int>();
            _factory = factory;
        }

        //[Theory]
        //[InlineData("/api/user")]
        //public async Task Get_EndpointsReturnSuccessAndCorrectContentType(string url)
        //{
        //    // Arrange
        //    var client = _factory.WithWebHostBuilder(builder =>
        //    {
        //        builder.ConfigureTestServices(services =>
        //        {
        //            services.AddAuthentication("Test")
        //                .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(
        //                    "Test", options => { });
        //        });
        //    })
        //    .CreateClient(new WebApplicationFactoryClientOptions
        //    {
        //        AllowAutoRedirect = false,
        //    });

        //    client.DefaultRequestHeaders.Authorization =
        //        new AuthenticationHeaderValue("Test");

        //    // Act
        //    var getDefaultResponse = await client.GetAsync(url);

        //    // Assert
        //    getDefaultResponse.EnsureSuccessStatusCode(); // Status Code 200-299
        //    Assert.Equal("application/json; charset=utf-8",
        //        getDefaultResponse.Content.Headers.ContentType.ToString());
        //}

        /// <summary>
        /// Asserts unauthorized results for all HttpGet calls on the user controller
        /// </summary>
        [Theory]
        [InlineData("/api/user")]
        [InlineData("/api/user/profile")]
        public async Task Get_InvalidScope_ReturnsUnauthorizedResult(string url)
        {
            // Arrange

            stack.Push(stack.Count);
            var client = _factory.CreateDefaultClient();
            var expected = HttpStatusCode.Unauthorized;

            // Act

            var count = stack.Count;
            var response = await client.GetAsync(url);

            // Assert

            Assert.Equal(1, count);
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
            resource.Mail = "Oslo@bodo.kommune.no";
            resource.Password = "Test12345@";
            resource.UserType = UserType.Municipality;

            // Act

            var response = await client.PutAsync(url, new StringContent(JsonSerializer.Serialize(resource), Encoding.UTF8, "application/json"));

            // Assert

            response.EnsureSuccessStatusCode(); // Status Code 200-299
            var user = JsonSerializer.Deserialize<PrivateSafeUserResource>(await response.Content.ReadAsStringAsync());
            //Assert.Equal(UserType.Municipality, user.UserType);
            //Assert.Equal("Bodø", user.MunicipalityName);
            // TODO: FIks kommune stuff
        }

        [Fact]
        public async Task Post_UserSignIn_EndpointsReturnSuccess()
        {
            // Arrange
            var client = _factory.CreateDefaultClient();
            
            NewUserResource newUserResource = new NewUserResource();
            newUserResource.Mail = "Test@bodo.kommune.no";
            newUserResource.Password = "Test12345@";

            // Act

            var newUserResponse = await client.PutAsync("api/user", new StringContent(JsonSerializer.Serialize(newUserResource), Encoding.UTF8, "application/json"));
            newUserResponse.EnsureSuccessStatusCode();
            
            //var token = "";
            //client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("bearer", token);
            AuthUserResource resource = new AuthUserResource();
            resource.Mail = "Test@bodo.kommune.no";
            resource.Password = "Test12345@";

            // Act

            // var loginResponse = await client.PostAsync("");

            var response = await client.PostAsync("/api/user/auth", new StringContent(JsonSerializer.Serialize(resource), Encoding.UTF8, "application/json"));

            // Assert

            response.EnsureSuccessStatusCode(); // Status Code 200-299
        }

        /// <summary>
        /// Asserts correct status code for all HttpGet calls on the user controller
        /// </summary>
        [Theory]
        [InlineData("/api/user/profile")]
        public async Task Get_EndpointsReturnSuccess(string url)
        {
            // Arrange

            var client = _factory.CreateDefaultClient();

            NewUserResource newUserResource = new NewUserResource();
            newUserResource.Mail = "profiletest@bodo.kommune.no";
            newUserResource.Password = "Test123456@";


            // Act

            var newUserResponse = await client.PutAsync("api/user", new StringContent(JsonSerializer.Serialize(newUserResource), Encoding.UTF8, "application/json"));
            newUserResponse.EnsureSuccessStatusCode();
            System.Threading.Thread.Sleep(5000);

            AuthUserResource loginResource = new AuthUserResource();
            loginResource.Mail = "profiletest@bodo.kommune.no";
            loginResource.Password = "Test123456@";
            var loginResponse = await client.PostAsync("/api/user/auth", new StringContent(JsonSerializer.Serialize(loginResource), Encoding.UTF8, "application/json"));
            loginResponse.EnsureSuccessStatusCode();
            System.Threading.Thread.Sleep(5000);

            var user = JsonSerializer.Deserialize<PrivateSafeUserResource>(await loginResponse.Content.ReadAsStringAsync());

            var token = user.Token;
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            // Act

            var response = await client.GetAsync(url);

            // Assert

            response.EnsureSuccessStatusCode(); // Status Code 200-299
        }

    }
}
