using Asisya.Application.DTOs.Product;
using FluentAssertions;
using System.Collections.Generic;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Xunit;

namespace Asisya.Tests.IntegrationTests
{
    public class ProductIntegrationTests : IClassFixture<CustomWebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;
        private readonly CustomWebApplicationFactory<Program> _factory;

        public ProductIntegrationTests(CustomWebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GetAllProducts_ReturnsSuccessAndList()
        {
            // Act
            var response = await _client.GetAsync("/api/products");

            // Assert
            response.EnsureSuccessStatusCode(); // Status Code 200-299
            var products = await response.Content.ReadFromJsonAsync<List<ProductDto>>();
            products.Should().NotBeNull();
            // Originally empty DB
        }
    }
}
