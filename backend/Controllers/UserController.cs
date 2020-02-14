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
using Microsoft.EntityFrameworkCore;

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
        private readonly IMunicipalityService municipalityService;

        public UserController(IUserService userService, ISecurityService securityService, IMapper mapper, IMunicipalityService municipalityService) 
		{
			this.usersService = userService;
            this.securityService = securityService;
            this.mapper = mapper;
            this.municipalityService = municipalityService;
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

        
        /// <summary>
        /// Creates a user with hashed+salted password.
        /// Also tries to tie the user to a municipality iff the user´s mail domain matches a municipality.
        /// </summary>
        /// <param name="newUser">A new user object which contains username and password</param>
        /// <returns>A PrivateSafeUserResource which does not include sensitive info.</returns>
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

            string mailDomain = newUser.Mail.Substring(newUser.Mail.IndexOf('@') + 1);
            Municipality municipality = await municipalityService.GetMunicipalityByDomainAsync(mailDomain);

            if (municipality != null)
            {
                user.MunicipalityName = municipality.Name;
            }

            try
            {
                user = await usersService.AddNewUserAsync(user);
            }
            catch (DbUpdateException)
            {
                return Conflict("User with the given mail already exists");
            }

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