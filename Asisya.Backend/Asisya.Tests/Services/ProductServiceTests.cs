using Asisya.Application.DTOs.Product;
using Asisya.Application.Interfaces;
using Asisya.Application.Services;
using Asisya.Domain.Entities;
using AutoMapper;
using FluentAssertions;
using Moq;
using System.Linq.Expressions;

namespace Asisya.Tests.Services
{
    public class ProductServiceTests
    {
        private readonly Mock<IRepository<Product>> _mockRepo;
        private readonly Mock<IMapper> _mockMapper;
        private readonly ProductService _productService;

        public ProductServiceTests()
        {
            _mockRepo = new Mock<IRepository<Product>>();
            _mockMapper = new Mock<IMapper>();
            _productService = new ProductService(_mockRepo.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnProducts()
        {
            // Arrange
            var products = new List<Product> { new Product { Id = 1, Name = "Laptop" } };
            var productDtos = new List<ProductDto> { new ProductDto { Id = 1, Name = "Laptop" } };

            _mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(products);
            _mockMapper.Setup(m => m.Map<IEnumerable<ProductDto>>(products)).Returns(productDtos);

            // Act
            var result = await _productService.GetAllAsync();

            // Assert
            result.Should().HaveCount(1);
            result.First().Name.Should().Be("Laptop");
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnProduct_WhenExists()
        {
             // Arrange
             var product = new Product { Id = 1, Name = "Phone" };
             var productDto = new ProductDto { Id = 1, Name = "Phone" };

             _mockRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(product);
             _mockMapper.Setup(m => m.Map<ProductDto>(product)).Returns(productDto);

             // Act
             var result = await _productService.GetByIdAsync(1);

             // Assert
             result.Should().NotBeNull();
             result.Name.Should().Be("Phone");
        }

        [Fact]
        public async Task CreateAsync_ShouldReturnCreatedProduct()
        {
            // Arrange
            var createDto = new CreateProductDto { Name = "NewItem", Price = 100 };
            var product = new Product { Id = 1, Name = "NewItem", Price = 100 };
            var productDto = new ProductDto { Id = 1, Name = "NewItem", Price = 100 };

            _mockMapper.Setup(m => m.Map<Product>(createDto)).Returns(product);
            _mockRepo.Setup(r => r.AddAsync(product)).Returns(Task.CompletedTask);
            _mockMapper.Setup(m => m.Map<ProductDto>(product)).Returns(productDto);

            // Act
            var result = await _productService.CreateAsync(createDto);

            // Assert
            result.Should().NotBeNull();
            result.Name.Should().Be("NewItem");
            _mockRepo.Verify(r => r.AddAsync(product), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_ShouldCallUpdate_WhenProductExists()
        {
            // Arrange
            var updateDto = new CreateProductDto { Name = "Updated", Price = 200 };
            var product = new Product { Id = 1, Name = "Old", Price = 100 };

            _mockRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(product);
            _mockMapper.Setup(m => m.Map(updateDto, product));

            // Act
            await _productService.UpdateAsync(1, updateDto);

            // Assert
            _mockRepo.Verify(r => r.UpdateAsync(product), Times.Once);
        }

        [Fact]
        public async Task DeleteAsync_ShouldCallDelete_WhenProductExists()
        {
            // Arrange
            var product = new Product { Id = 1, Name = "Old" };

            _mockRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(product);

            // Act
            await _productService.DeleteAsync(1);

            // Assert
            _mockRepo.Verify(r => r.DeleteAsync(product), Times.Once);
        }
    }
}
