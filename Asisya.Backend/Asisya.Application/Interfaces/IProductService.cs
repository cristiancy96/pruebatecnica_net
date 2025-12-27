using System.Collections.Generic;
using System.Threading.Tasks;
using Asisya.Application.DTOs.Product;

namespace Asisya.Application.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDto>> GetAllAsync();
        Task<ProductDto?> GetByIdAsync(int id);
        Task<ProductDto> CreateAsync(CreateProductDto createProductDto);
        Task UpdateAsync(int id, CreateProductDto updateProductDto);
        Task DeleteAsync(int id);
    }
}
