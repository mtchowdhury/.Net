using Product.Application.Contracts.Repositories;
using Product.Application.Contracts.Repositories.Command;
using Product.Application.Contracts.Repositories.Query;
using Product.Shared.DTOs.Base;
using Product.Shared.DTOs.Product;
using Shared.Commands.Product;

namespace Product.Application.CommandHandlers.Product;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, object>
{
    private readonly IProductCommandRepository _productCommandRepository;
    private readonly IProductQueryRepository _productQueryRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    public CreateProductCommandHandler(IProductCommandRepository productCommandRepository
        , IProductQueryRepository productQueryRepository
        , IUnitOfWork unitOfWork
        , IMapper mapper)
    {
        _productCommandRepository = productCommandRepository;
        _productQueryRepository = productQueryRepository;
        _mapper = mapper;
        _unitOfWork = unitOfWork;
    }
    public async Task<object> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var dbProduct = _mapper.Map<CreateProductCommand, Core.Entities.Product>(request);
        dbProduct.Id = Guid.NewGuid();
        dbProduct.Code = ""+request.ProductTypeFirstLetter + ((await _productQueryRepository.GetProductCountByProductType(request.ProductTypeId))+10);//As product code start from 10
        var result = await _productCommandRepository.InsertAsync(dbProduct);
        var affectedRows = await _unitOfWork.CommitAsync();
        var productAddResponse = new PostResponseDTO<Guid, ProductPostResponseDTO>
        {
            Id = dbProduct.Id
            ,
            Success = affectedRows > 0
            ,
            Message = affectedRows > 0 ? "Product created successfully" : "Something went wrong. Please try again"
            ,
            Entity = _mapper.Map<Core.Entities.Product, ProductPostResponseDTO>(result)
        };
        return productAddResponse;
    }
}
