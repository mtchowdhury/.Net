using Product.Application.Contracts.Repositories.Command;
using Product.Application.Contracts.Repositories;
using Shared.Commands.Product;
using Product.Shared.DTOs.Base;
using Product.Shared.DTOs.Product;
using Product.Application.Contracts.Repositories.Query;
using Product.Application.Common.Exceptions;

namespace Product.Application.CommandHandlers.Product;

public class UpdateProductCommandHandler : IRequestHandler<UpdateProductCommand, object>
{
    private readonly IProductCommandRepository _productCommandRepository;
    private readonly IProductQueryRepository _productQueryRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    public UpdateProductCommandHandler(IProductCommandRepository productCommandRepository
        , IProductQueryRepository productQueryRepository
        , IUnitOfWork unitOfWork
        , IMapper mapper)
    {
        _productCommandRepository = productCommandRepository;
        _productQueryRepository = productQueryRepository;
        _mapper = mapper;
        _unitOfWork = unitOfWork;
    }
    public async Task<object> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var dbProduct =await _productCommandRepository.Get(request.Id);
        if (dbProduct == null)
            throw new NotFoundException("Product not found");
        var productToUpdate=_mapper.Map(request, dbProduct);
        var result = await _productCommandRepository.UpdateAsync(productToUpdate);
        var affectedRows =await _unitOfWork.CommitAsync();
        var productAddResponse = new PostResponseDTO<Guid, ProductPostResponseDTO>
        {
            Id = productToUpdate.Id
            ,
            Success = affectedRows > 0
            ,
            Message = affectedRows > 0 ? "Product updated successfully" : "Something went wrong. Please try again"
            ,
            Entity = _mapper.Map<Core.Entities.Product, ProductPostResponseDTO>(result)
        };
        return productAddResponse;
    }
}
