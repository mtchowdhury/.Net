using Dapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Product.Application.Contracts.Repositories.Query;
using Product.Application.Queries.Product;
using Product.Core.CompositeEntities;
using Product.Infrastructure.Configs;
using Product.Infrastructure.Repository.Query.Base;

namespace Product.Infrastructure.Repository.Query;

public class ProductListQueryRepository : MultipleResultQueryRepository<Core.CompositeEntities.ProductList>, IProductListQueryRepository
{
    public ProductListQueryRepository(IConfiguration configuration, IOptions<ProductSettings> settings) : base(configuration, settings)
    {
    }

    public async Task<(long, IEnumerable<ProductList>)> GetAll(GetAllProductQuery query)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@pageNumber", query.PageNumber);
        parameters.Add("@pageSize", query.PageSize);
        parameters.Add("@status", query.Status);
        var sql = "product.usp_SELProducts";
        return await GetMultipleResultAsync(sql, parameters, true);
    }
}
