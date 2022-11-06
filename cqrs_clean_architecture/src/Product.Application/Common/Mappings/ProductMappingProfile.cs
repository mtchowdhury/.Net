using Product.Shared.DTOs.Product;
using Shared.Commands.Product;

namespace Product.Application.Common.Mappings;
public class ProductMappingProfile:Profile
{
    public ProductMappingProfile()
    {
        CreateMap<Core.Entities.Product, ProductGetResponseDTO>().ReverseMap();
        CreateMap<Core.Entities.Product, ProductListGetResponseDTO>().ReverseMap();
        CreateMap<Core.CompositeEntities.ProductList, ProductListGetResponseDTO>().ReverseMap();

        CreateMap<Core.Entities.Product, CreateProductCommand>().ReverseMap();
        CreateMap<Core.Entities.Product, UpdateProductCommand>().ReverseMap();

        CreateMap<Core.Entities.Product, ProductPostResponseDTO>().ReverseMap();
    }    
}
