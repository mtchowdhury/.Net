using Product.Application.Contracts.Repositories.Query;
using Product.Shared.DTOs.Base;
using Product.Shared.DTOs.Product;

namespace Product.Application.Queries.Product
{
    public class GetAllProductQueryHandler : IRequestHandler<GetAllProductQuery, PaginatedListResponseDTO<ProductListGetResponseDTO>>
    {
        private readonly IProductListQueryRepository _productListQueryRepository;
        private readonly IMapper _mapper;
        public GetAllProductQueryHandler(IProductListQueryRepository productListQueryRepository
            ,IMapper mapper)
        {
            _productListQueryRepository = productListQueryRepository;
            _mapper= mapper;
        }
        public async Task<PaginatedListResponseDTO<ProductListGetResponseDTO>> Handle(GetAllProductQuery request, CancellationToken cancellationToken)
        {
            var (count,products) =await _productListQueryRepository.GetAll(request);
            return new PaginatedListResponseDTO<ProductListGetResponseDTO>(_mapper.Map<List<ProductListGetResponseDTO>>(products), count, request.PageNumber, request.PageSize);
        }
    }
}
