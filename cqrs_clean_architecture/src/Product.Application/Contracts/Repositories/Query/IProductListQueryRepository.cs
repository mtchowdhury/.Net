using Product.Application.Contracts.Repositories.Query.Base;
using Product.Application.Queries.Product;
namespace Product.Application.Contracts.Repositories.Query;
public interface IProductListQueryRepository : IMultipleResultQueryRepository<Core.CompositeEntities.ProductList>
{
    Task<(long, IEnumerable<Core.CompositeEntities.ProductList>)> GetAll(GetAllProductQuery query);
}
