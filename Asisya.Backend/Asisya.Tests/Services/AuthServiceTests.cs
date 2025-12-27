using Asisya.Application.DTOs.Auth;
using Asisya.Application.Interfaces;
using Asisya.Application.Services;
using Asisya.Domain.Entities;
using AutoMapper;
using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Moq;
using System.Linq.Expressions;

namespace Asisya.Tests.Services
{
    public class AuthServiceTests
    {
        private readonly Mock<IRepository<User>> _mockRepo;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<IConfiguration> _mockConfig;
        private readonly AuthService _authService;

        public AuthServiceTests()
        {
            _mockRepo = new Mock<IRepository<User>>();
            _mockMapper = new Mock<IMapper>();
            _mockConfig = new Mock<IConfiguration>();

            _mockConfig.Setup(c => c["Jwt:Key"]).Returns("SuperSecretKeyForTesting1234567890!");
            _mockConfig.Setup(c => c["Jwt:Issuer"]).Returns("TestIssuer");
            _mockConfig.Setup(c => c["Jwt:Audience"]).Returns("TestAudience");

            _authService = new AuthService(_mockRepo.Object, _mockMapper.Object, _mockConfig.Object);
        }

        [Fact]
        public async Task RegisterAsync_ShouldReturnToken_WhenUserDoesNotExist()
        {
            // Arrange
            var registerDto = new RegisterDto { Username = "newuser", Password = "password" };
            var user = new User { Id = 1, Username = "newuser", Role = "User", PasswordHash = "hashed" };

            _mockRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<User, bool>>>()))
                .ReturnsAsync(new List<User>()); // No existing user

            _mockMapper.Setup(m => m.Map<User>(registerDto)).Returns(user);
            _mockRepo.Setup(r => r.AddAsync(It.IsAny<User>())).Returns(Task.CompletedTask);

            // Act
            var result = await _authService.RegisterAsync(registerDto);

            // Assert
            result.Should().NotBeNull();
            result.Token.Should().NotBeNullOrEmpty();
            result.Username.Should().Be("newuser");
            _mockRepo.Verify(r => r.AddAsync(It.IsAny<User>()), Times.Once);
        }

        [Fact]
        public async Task RegisterAsync_ShouldThrowException_WhenUserExists()
        {
            // Arrange
            var registerDto = new RegisterDto { Username = "existinguser", Password = "password" };
            var existingUser = new User { Id = 1, Username = "existinguser" };

            _mockRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<User, bool>>>()))
                .ReturnsAsync(new List<User> { existingUser });

            // Act
            Func<Task> act = async () => await _authService.RegisterAsync(registerDto);

            // Assert
            await act.Should().ThrowAsync<Exception>().WithMessage("Username already exists");
            _mockRepo.Verify(r => r.AddAsync(It.IsAny<User>()), Times.Never);
        }

        [Fact]
        public async Task LoginAsync_ShouldReturnToken_WhenCredentialsAreValid()
        {
            // Arrange
            var loginDto = new LoginDto { Username = "existinguser", Password = "password" };
            var passwordHash = BCrypt.Net.BCrypt.HashPassword("password");
            var user = new User { Id = 1, Username = "existinguser", Role = "User", PasswordHash = passwordHash };

            _mockRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<User, bool>>>()))
                .ReturnsAsync(new List<User> { user });

            // Act
            var result = await _authService.LoginAsync(loginDto);

            // Assert
            result.Should().NotBeNull();
            result.Token.Should().NotBeNullOrEmpty();
        }

        [Fact]
        public async Task LoginAsync_ShouldThrowException_WhenPasswordIsInvalid()
        {
            // Arrange
            var loginDto = new LoginDto { Username = "existinguser", Password = "wrongpassword" };
            var passwordHash = BCrypt.Net.BCrypt.HashPassword("password");
            var user = new User { Id = 1, Username = "existinguser", Role = "User", PasswordHash = passwordHash };

            _mockRepo.Setup(r => r.FindAsync(It.IsAny<Expression<Func<User, bool>>>()))
                .ReturnsAsync(new List<User> { user });

            // Act
            Func<Task> act = async () => await _authService.LoginAsync(loginDto);

            // Assert
            await act.Should().ThrowAsync<Exception>().WithMessage("Invalid credentials");
        }
    }
}
