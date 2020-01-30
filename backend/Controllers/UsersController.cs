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

namespace OpenData.Controllers
{
    [Authorize]
    [ApiController]
	[Route("/api/[controller]")]
	public class UsersController : Controller
	{
		private readonly IUsersService usersService;

		public UsersController(IUsersService userService) 
		{
			this.usersService = userService;
		}

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Authenticate([FromBody] AuthModel authModel)
        {
            User user = await usersService.AuthenticateAsync(authModel.Mail, authModel.Password);

            if (user == null)
            {
                return BadRequest(new { message = "Incorrect mail or password" });
            }

            return Ok(user);
        }

        

        [AllowAnonymous]
        [HttpPost("createuser")]
        public async Task<IActionResult> CreateUser([FromBody] NewUserModel newUser)
        {
            if (Validator.IsValidMail(newUser.Mail) == false)
                return BadRequest(new { message = "Mail did not pass Regex" });
            if(Validator.IsValidPassword(newUser.Password) == false)
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


        [HttpGet("getusers")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await usersService.GetAllUsersAsync();
            return Ok(users);
        }
    }
}