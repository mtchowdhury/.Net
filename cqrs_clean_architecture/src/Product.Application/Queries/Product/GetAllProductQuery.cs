using Product.Shared.DTOs.Base;
using Product.Shared.DTOs.Product;

namespace Product.Application.Queries.Product;

public class GetAllProductQuery : IRequest<PaginatedListResponseDTO<ProductListGetResponseDTO>>
{
    const int MAX_PAGE_SIZE = 50;
    public int PageNumber { get; set; } = 1;

    private int _pageSize = 1;
    public int PageSize
    {
        get
        {
            return _pageSize;
        }
        set
        {
            _pageSize = (value > MAX_PAGE_SIZE) ? MAX_PAGE_SIZE : value;
        }
    }
    public bool Status { get; set; } = true;
}
