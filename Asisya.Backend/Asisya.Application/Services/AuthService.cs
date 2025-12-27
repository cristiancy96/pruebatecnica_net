using Asisya.Application.DTOs.Auth;
using Asisya.Application.Interfaces;
using Asisya.Domain.Entities;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Asisya.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IRepository<User> _userRepository;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;

        public AuthService(IRepository<User> userRepository, IMapper mapper, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            var user = (await _userRepository.FindAsync(u => u.Username == loginDto.Username)).FirstOrDefault();
            
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                throw new Exception("Invalid credentials");
            }

            var token = GenerateJwtToken(user);
            return new AuthResponseDto { Token = token, Username = user.Username };
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
        {
             var existing = (await _userRepository.FindAsync(u => u.Username == registerDto.Username)).FirstOrDefault();
             if (existing != null) throw new Exception("Username already exists");

             var user = _mapper.Map<User>(registerDto);
             user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);
             user.Role = "Admin"; // Default role for test purposes
             
             await _userRepository.AddAsync(user);

             var token = GenerateJwtToken(user);
             return new AuthResponseDto { Token = token, Username = user.Username };
        }

        private string GenerateJwtToken(User user)
        {
            var jwtKey = _configuration["Jwt:Key"] ?? "SuperSecretKeyForAsisyaProject12345!"; // Default for dev
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role), 
                new Claim("id", user.Id.ToString())
            };

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
