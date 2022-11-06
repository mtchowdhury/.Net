using Product.Application.Contracts.Repositories.Query;
using Shared.Commands.Product;
using System.Text.RegularExpressions;

namespace Product.Application.CommandHandlers.Product;

public class UpdateProductCommandValidator:AbstractValidator<UpdateProductCommand>
{
    private readonly IProductQueryRepository _productQueryRepository;
    public UpdateProductCommandValidator(IProductQueryRepository productQueryRepository)
    {
        _productQueryRepository = productQueryRepository;
        CascadeMode = CascadeMode.Stop;
        RuleFor(p => p.Name)
            .NotNull().WithMessage("Product Name can not be null")
            .NotEmpty().WithMessage("Product Name can not be empty");
        RuleFor(p => p.ShortName)
            .NotNull().WithMessage("Product Short Name can not be null")
            .NotEmpty().WithMessage("Product Short Name can not be empty");
        RuleFor(p => p.ProductTypeId).NotNull().NotEmpty().WithMessage("Product Type is required");
        RuleFor(p => p.CategoryId).NotNull().NotEmpty().WithMessage("Product Category is required");
        RuleFor(p => p.ProductTypeFirstLetter).NotNull().NotEmpty().WithMessage("Product Type First Letter is required");
        RuleFor(p => p.EffectiveFrom).NotNull().NotEmpty().WithMessage("Product Effective From Date can not be null or empty");
        RuleFor(p => p.EffectiveTo).NotNull().NotEmpty().WithMessage("Product Effective To Date can not be null or empty");
        //RuleFor(p => p.EffectiveFrom).LessThanOrEqualTo(p => p.EffectiveTo).WithMessage("Effective From Date Can't be greater than or equal to Effective To Date");
        RuleFor(p => new {p.Id, p.Name,p.ShortName, p.EffectiveFrom, p.EffectiveTo, p.ProductTypeId, p.CategoryId }).CustomAsync(async (property, context, cancellationToken) =>
        {
            if (property.EffectiveFrom.Date >= property.EffectiveTo.Date)
                context.AddFailure("Effective From Date Can't be greater than or equal to Effective To Date");
            if (!await _productQueryRepository.IsUniqueProductName(property.Name,property.Id))
                context.AddFailure("Product name already exists");
            if (!await _productQueryRepository.IsValidDateRange(property.EffectiveFrom, property.EffectiveTo, property.ProductTypeId, property.CategoryId,property.Id))
                context.AddFailure("Same Date Range Product configuration already exists");
            var regexAlphanumericWithSpace = new Regex("^[a-zA-Z0-9 ]+$");//Regex for Alphanumeric with space
            if (!regexAlphanumericWithSpace.IsMatch(property.Name))
                context.AddFailure("Only Alphanumeric is allowed for Name");
            if (!regexAlphanumericWithSpace.IsMatch(property.ShortName))
                context.AddFailure("Only Alphanumeric is allowed for Short Name");
        });
    }
}
