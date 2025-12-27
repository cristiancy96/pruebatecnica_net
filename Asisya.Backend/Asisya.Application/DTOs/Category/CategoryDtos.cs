using System.Collections.Generic;
using Asisya.Application.DTOs.Product;

namespace Asisya.Application.DTOs.Category
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int ProductCount { get; set; }
    }

    public class CategoryDetailDto : CategoryDto
    {
        public ICollection<ProductDto> Products { get; set; } = new List<ProductDto>();
    }

    public class CreateCategoryDto
    {
        public string Name { get; set; } = string.Empty;
    }
}
