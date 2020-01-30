using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using OpenData.Domain.Models;
using OpenData.Domain.Repositories;
using OpenData.Persistence.Contexts;
using OpenData.Helpers;
using Microsoft.Extensions.Options;

namespace OpenData.Persistence.Repositories
{
    public class UserRepository : BaseRepository, IUserRepository
    {
        AppSettings appSettings;

        public UserRepository(AppDbContext context, IOptions<AppSettings> options) : base(context)
        {
            appSettings = options.Value;
        }

        public async Task<User> Authenticate(string mail, string password)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.Mail == mail);

            // User does not exist
            if (user == null)
                return null;

            var userSalt = user.PasswordSalt;
            var passwordHash = Hasher.HashPassword(password, userSalt);

            // Incorrect password
            if(user.Password != passwordHash)
                return null;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[] {
                    new Claim(ClaimTypes.Email, user.Mail)
                }),
                Expires = DateTime.UtcNow.AddDays(3),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            user.Token = tokenHandler.WriteToken(token);
            await _context.SaveChangesAsync();

            return user.PrepForTransport();
        }

        public async Task<User> AddNewUserAsync(User user)
        {
            var addedUser = await _context.AddAsync<User>(user);

            await _context.SaveChangesAsync();
            return addedUser.Entity;
        }

        public async Task<IEnumerable<User>> GetAll()
        {
            return (await _context.Users.ToListAsync()).PrepForTransport();
        }
    }
}