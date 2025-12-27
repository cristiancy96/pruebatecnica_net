using AutoMapper;
using Asisya.Application.DTOs.Product;
using Asisya.Application.DTOs.Category;
using Asisya.Application.DTOs.Auth;
using Asisya.Domain.Entities;

namespace Asisya.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Product, ProductDto>()
                .ForMember(d => d.CategoryName, o => o.MapFrom(s => s.Category != null ? s.Category.Name : string.Empty));
            CreateMap<CreateProductDto, Product>();

            CreateMap<Category, CategoryDto>()
                .ForMember(d => d.ProductCount, o => o.MapFrom(s => s.Products.Count));
            CreateMap<Category, CategoryDetailDto>();
            CreateMap<CreateCategoryDto, Category>();
            
            CreateMap<RegisterDto, User>()
                 .ForMember(d => d.PasswordHash, o => o.Ignore()); // Handle hashing manually
        }
    }
}
