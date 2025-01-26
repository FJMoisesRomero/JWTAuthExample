using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using UserAuthAPI.Data;
using UserAuthAPI.DTOs;
using UserAuthAPI.Models;

namespace UserAuthAPI.Services
{
    public class AuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private const int WORK_FACTOR = 12;

        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<(bool success, string message, UserDTO? user)> Register(RegisterDTO registerDto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                return (false, "User already exists", null);
            }

            string salt = BCrypt.Net.BCrypt.GenerateSalt(WORK_FACTOR);
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password, salt);

            var user = new User
            {
                Username = registerDto.Username,
                Email = registerDto.Email,
                PasswordHash = passwordHash,
                ProfileImageUrl = registerDto.ProfileImageUrl
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return (true, "Registration successful", MapToDTO(user));
        }

        public async Task<(bool success, string message, string? token, UserDTO? user)> Login(LoginDTO loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            if (user == null)
            {
                return (false, "User not found", null, null);
            }

            try
            {
                bool isValidPassword = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);
                if (!isValidPassword)
                {
                    return (false, "Wrong password", null, null);
                }
            }
            catch (BCrypt.Net.SaltParseException)
            {
                return (false, "Invalid password format", null, null);
            }

            string token = CreateToken(user);
            return (true, "Login successful", token, MapToDTO(user));
        }

        public async Task<List<UserDTO>> GetAllUsers()
        {
            var users = await _context.Users.ToListAsync();
            return users.Select(MapToDTO).ToList();
        }

        private string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        private static UserDTO MapToDTO(User user)
        {
            return new UserDTO
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                ProfileImageUrl = user.ProfileImageUrl,
                CreatedAt = user.CreatedAt
            };
        }
    }
}
