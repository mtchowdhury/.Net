using Product.Application.Contracts.Repositories.Query;
using Product.Shared.DTOs.Product;

namespace Product.Application.Queries.Product;

public class GetProductByIdQueryHandler : IRequestHandler<GetProductByIdQuery, ProductGetResponseDTO>
{
    private readonly IProductQueryRepository _productQueryRepository;
    private readonly IMapper _mapper;
    public GetProductByIdQueryHandler(IProductQueryRepository productQueryRepository
        ,IMapper mapper)
    {
        _productQueryRepository = productQueryRepository;
        _mapper = mapper;
    }
    public async Task<ProductGetResponseDTO> Handle(GetProductByIdQuery request, CancellationToken cancellationToken)
    {
        return _mapper.Map<Core.Entities.Product, ProductGetResponseDTO>(await _productQueryRepository.Get(request.Id));
    }
}
