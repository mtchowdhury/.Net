using Product.Shared.DTOs.Product;
namespace Product.Application.Queries.Product;
public record GetProductByIdQuery(Guid Id) : IRequest<ProductGetResponseDTO>;
