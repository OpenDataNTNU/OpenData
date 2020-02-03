using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

using OpenData.Domain.Models;
using OpenData.Domain.Services;
using OpenData.Resources;
using OpenData.Services;
using OpenData.Helpers;
using OpenData.Extensions;

namespace OpenData.Controllers
{
    [Authorize]
    [ApiController]
	[Route("/api/[controller]")]
	public class UserController : Controller
	{
		private readonly IUserService usersService;

		public UserController(IUserService userService) 
		{
			this.usersService = userService;
		}

        [AllowAnonymous]
        [HttpPost("auth")]
        public async Task<IActionResult> Authenticate([FromBody] AuthUserResource authUserResource)
        {
            User user = await usersService.AuthenticateAsync(authUserResource.Mail, authUserResource.Password);

            if (user == null)
            {
                return BadRequest(new { message = "Incorrect mail or password" });
            }

            return Ok(user);
        }

        

        [AllowAnonymous]
        [HttpPut]
        public async Task<IActionResult> CreateUser([FromBody] NewUserResource newUser)
        {
            if (newUser.IsValidMail() == false)
                return BadRequest(new { message = "Mail did not pass Regex" });
            if(newUser.IsValidPassword() == false)
                return BadRequest(new { message = "Password did not pass Regex" });

            string salt = Hasher.GenerateSalt();
            string hashedPassword = Hasher.HashPassword(newUser.Password, salt);

            User user = new User { Mail = newUser.Mail, Password = hashedPassword, PasswordSalt = salt };
            user = await usersService.AddNewUserAsync(user);

            if (user == null)
            {
                return BadRequest(new { message = "Could not create user" });
            }

            return Ok(user);
        }


        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await usersService.GetAllUsersAsync();
            return Ok(users);
        }
    }
}