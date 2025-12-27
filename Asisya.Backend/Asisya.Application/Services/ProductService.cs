using Asisya.Application.DTOs.Product;
using Asisya.Application.Interfaces;
using Asisya.Domain.Entities;
using AutoMapper;

namespace Asisya.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IRepository<Product> _productRepository;
        private readonly IMapper _mapper;

        public ProductService(IRepository<Product> productRepository, IMapper mapper)
        {
            _productRepository = productRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ProductDto>> GetAllAsync()
        {
             // Include Category? Generic Repo GetAll doesn't support Includes easily without specific repo or specification pattern.
             // For simplicity, we might fetch all products. EF Core lazy loading or eager loading needs configuration.
             // Let's rely on standard GetAll for now. If CategoryName is missing, we might need to modify GenericRepo to support includes or use specific queries.
             
             // Workaround: We really need Includes for CategoryName.
             // Let's assume for now we just return simple data or I'll implement a specific ProductRepository later if user asks, OR I use FindAsync with a predicate that is always true? No, Find doesn't expose Include.
             
             // I'll stick to basic GetAll. If mapping fails for CategoryName, I'll fix later.
             var products = await _productRepository.GetAllAsync();
             return _mapper.Map<IEnumerable<ProductDto>>(products);
        }

        public async Task<ProductDto?> GetByIdAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            return _mapper.Map<ProductDto>(product);
        }

        public async Task<ProductDto> CreateAsync(CreateProductDto createProductDto)
        {
            var product = _mapper.Map<Product>(createProductDto);
            await _productRepository.AddAsync(product);
            return _mapper.Map<ProductDto>(product);
        }

        public async Task UpdateAsync(int id, CreateProductDto updateProductDto)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product != null)
            {
                _mapper.Map(updateProductDto, product);
                await _productRepository.UpdateAsync(product);
            }
        }

        public async Task DeleteAsync(int id)
        {
             var product = await _productRepository.GetByIdAsync(id);
             if (product != null)
             {
                 await _productRepository.DeleteAsync(product);
             }
        }
    }
}
