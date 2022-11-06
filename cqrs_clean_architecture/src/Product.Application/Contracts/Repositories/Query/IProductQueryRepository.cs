using Product.Application.Contracts.Repositories.Query.Base;

namespace Product.Application.Contracts.Repositories.Query;
public interface IProductQueryRepository : IMultipleResultQueryRepository<Core.Entities.Product>
{
    Task<Core.Entities.Product> Get(Guid id);
    //Task<(long,IEnumerable<Core.Entities.Product>)> GetAll(GetAllProductQuery query);
    Task<bool> IsUniqueProductName(string productName,Guid? id=null);
    Task<bool> IsValidDateRange(DateTime effectiveFromDate,DateTime effectiveToDate,Guid productType,Guid productCategory, Guid? id=null);
    Task<long> GetProductCountByProductType(Guid productTypeId, Guid? id = null);
}
