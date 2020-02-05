using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

using OpenData.Domain.Models;
using OpenData.Domain.Services;
using OpenData.Resources;
using OpenData.Services;
using OpenData.Extensions;

using AutoMapper;

namespace OpenData.Controllers
{
    [Authorize]
    [ApiController]
	[Route("/api/[controller]")]
	public class UserController : Controller
	{
		private readonly IUserService usersService;
        private readonly ISecurityService securityService;
        private readonly IMapper mapper;

        public UserController(IUserService userService, ISecurityService securityService, IMapper mapper) 
		{
			this.usersService = userService;
            this.securityService = securityService;
            this.mapper = mapper;
        }

        [AllowAnonymous]
        [HttpPost("auth")]
        public async Task<IActionResult> Authenticate([FromBody] AuthUserResource authUserResource)
        {
            User user = await usersService.AuthenticateAsync(authUserResource.Mail, authUserResource.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Incorrect mail or password" });
            }

            PrivateSafeUserResource privateSafeUser = mapper.Map <User, PrivateSafeUserResource>(user);
            return Ok(privateSafeUser);
        }

        

        [AllowAnonymous]
        [HttpPut]
        public async Task<IActionResult> CreateUser([FromBody] NewUserResource newUser)
        {
            if (newUser.IsValidMail() == false)
                return BadRequest(new { message = "Mail did not pass Regex" });
            if(newUser.IsValidPassword() == false)
                return BadRequest(new { message = "Password did not pass Regex" });

            string salt = securityService.GenerateSalt();
            string hashedPassword = securityService.HashPassword(newUser.Password, salt);

            User user = new User { Mail = newUser.Mail, Password = hashedPassword, PasswordSalt = salt };
            user.PasswordSalt = salt;
            user = await usersService.AddNewUserAsync(user);

            PrivateSafeUserResource safeUser = mapper.Map<User, PrivateSafeUserResource>(user);

            if (user == null)
            {
                return BadRequest(new { message = "Could not create user" });
            }

            return Created("Created new user successfully!", safeUser);
        }


        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await usersService.GetAllUsersAsync();
            var safeUsers = mapper.Map<IEnumerable<User>, IEnumerable<SafeUserResource>>(users);
            return Ok(safeUsers);
        }
    }
}