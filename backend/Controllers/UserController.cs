using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

using OpenData.Domain.Models;
using OpenData.Domain.Services;
using OpenData.Resources;
using OpenData.Services;
using OpenData.Extensions;

using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System.Linq;

namespace OpenData.Controllers
{
    /// <summary>
    /// UserController is the main controller for all user related handling.
    /// In essence creation, login, fetching of userdata.
    /// </summary>
    [Authorize]
    [ApiController]
    [Route("/api/[controller]")]
    public class UserController : Controller
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly IUserService usersService;
        private readonly ISecurityService securityService;
        private readonly IMapper mapper;
        private readonly IMunicipalityService municipalityService;

        public UserController(IUserService userService, IHttpContextAccessor httpContextAccessor, ISecurityService securityService, IMapper mapper, IMunicipalityService municipalityService)
        {
            this.usersService = userService;
            this.securityService = securityService;
            this.mapper = mapper;
            this.municipalityService = municipalityService;
            this.httpContextAccessor = httpContextAccessor;
        }

        /// <summary>
        /// /auth is used for authentication/logging in.
        /// By calling it with username and password in JSON format in it´s body you will get a result.
        /// The result is an error or proof of authentication.
        /// </summary>
        /// <param name="authUserResource"></param>
        /// <returns>
        /// The result will either be some sort of error message, or an user object with a token field.
        /// The JWT Token is proof of authentication.
        /// </returns>
        [AllowAnonymous]
        [HttpPost("auth")]
        public async Task<IActionResult> Authenticate([FromBody] AuthUserResource authUserResource)
        {
            User user = await usersService.AuthenticateAsync(authUserResource.Mail, authUserResource.Password);

            if (user == null)
            {
                return Unauthorized(new { message = "Incorrect mail or password" });
            }

            PrivateSafeUserResource privateSafeUser = mapper.Map<User, PrivateSafeUserResource>(user);
            return Ok(privateSafeUser);
        }


        /// <summary>
        /// Creates a user with hashed+salted password.
        /// Iff the user type is set to municipality and the user has a municipality given mail domain,
        /// the user will be tied to a municipality.
        /// </summary>
        /// <param name="newUser">A new user object which contains username, password and usertype</param>
        /// <returns>A PrivateSafeUserResource which does not include sensitive info.</returns>
        [AllowAnonymous]
        [HttpPut]
        public async Task<IActionResult> CreateUser([FromBody] NewUserResource newUser)
        {
            if (newUser.IsValidMail() == false)
                return BadRequest(new { message = "Mail did not pass Regex" });
            if (newUser.IsValidPassword() == false)
                return BadRequest(new { message = "Password did not pass Regex" });

            string salt = securityService.GenerateSalt();
            string hashedPassword = securityService.HashPassword(newUser.Password, salt);

            User user = new User
            {
                Mail = newUser.Mail,
                Password = hashedPassword,
                PasswordSalt = salt,
                UserType = newUser.UserType
            };

            if (user.UserType == UserType.Municipality)
            {
                string mailDomain = newUser.Mail.Substring(newUser.Mail.IndexOf('@') + 1);
                Municipality municipality = await municipalityService.GetMunicipalityByDomainAsync(mailDomain);
                if (municipality == null)
                {
                    return BadRequest("Invalid municipality domain given for municipality account!");
                }
                user.MunicipalityName = municipality.Name;
            }
            else if (user.UserType == UserType.Admin)
            {
                return BadRequest("You do not have permissions to create an admin account!");
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

        /// <summary>
        /// Get user is a development function that may be removed.
        /// It´s functionality is to get a user object, similar to the one you get after login.
        /// </summary>
        /// <returns>
        /// User object is returned.
        /// </returns>
        [HttpGet("profile")]
        public async Task<IActionResult> GetUser()
        {
            var targetUsername = httpContextAccessor.HttpContext.User.Identity.Name;
            User user = await usersService.GetUserByMailAsync(targetUsername);
            SafeUserResource privateSafeUser = mapper.Map<User, SafeUserResource>(user);
            return Ok(privateSafeUser);
        }

        /// <summary>
        /// Get alls users gets all user, with sensitive information removed (like tokens).
        /// </summary>
        /// <returns>
        /// The users fetched.
        /// </returns>
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await usersService.GetAllUsersAsync();
            var safeUsers = mapper.Map<IEnumerable<User>, IEnumerable<SafeUserResource>>(users);
            return Ok(safeUsers);
        }
    }
}