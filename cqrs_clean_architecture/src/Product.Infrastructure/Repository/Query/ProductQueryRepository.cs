using Dapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Product.Application.Contracts.Repositories.Query;
using Product.Infrastructure.Configs;
using Product.Infrastructure.Repository.Query.Base;

namespace Product.Infrastructure.Repository.Query;

public class ProductQueryRepository : MultipleResultQueryRepository<Core.Entities.Product>, IProductQueryRepository
{
    public ProductQueryRepository(IConfiguration configuration, IOptions<ProductSettings> settings) : base(configuration, settings)
    {

    }
    public async Task<Core.Entities.Product> Get(Guid id)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@Id", id);
        var sql = $@"Select
                    Id
                    ,ProductTypeId
                    ,Name
                    ,ShortName
                    ,Code
                    ,CategoryId
                    ,EffectiveFrom
                    ,EffectiveTo
                    ,SortOrder
                    ,Status
                    from 
                    product.Product
                    where Id=@Id
                    ";
        return await SingleAsync(sql, parameters);
    }

    //public async Task<(long,IEnumerable<Core.Entities.Product>)> GetAll(GetAllProductQuery query)
    //{
    //    var parameters = new DynamicParameters();
    //    parameters.Add("@pageNumber", query.PageNumber);
    //    parameters.Add("@pageSize", query.PageSize);
    //    parameters.Add("@status", query.Status);
    //    var sql = "spName";
    //    return await GetMultipleResultAsync(sql, parameters, false);
    //}

    public async Task<bool> IsUniqueProductName(string productName, Guid? id=null)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@productName",productName);
        var sql = "Select Count(1) as [Count] from product.Product where Name=@productName";
        if (id != null)
        {
            parameters.Add("@id", id);
            sql += " AND Id<>@id";
        }
        return (await SingleCountAsync(sql, parameters))==0;
    }

    public async Task<bool> IsValidDateRange(DateTime effectiveFromDate, DateTime effectiveToDate, Guid productType,Guid productCategory, Guid? id = null)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@effectiveFromDate", effectiveFromDate.Date);
        parameters.Add("@effectiveToDate", effectiveToDate.Date);
        parameters.Add("@productType", productType);
        parameters.Add("@productCategory", productCategory);
        var sql = @"Select Count(1) as [Count] 
            from product.Product 
            where 
            ProductTypeId=@productType AND CategoryId=@productCategory
            AND ((@effectiveFromDate>=CAST(EffectiveFrom as DATE) AND @effectiveFromDate<=CAST(EffectiveTo as DATE))
            OR (@effectiveToDate>=CAST(EffectiveFrom as DATE) AND @effectiveToDate<=CAST(EffectiveTo as DATE)))";
        if (id != null)
        {
            parameters.Add("@id", id);
            sql += " AND Id<>@id";
        }
        return (await SingleCountAsync(sql, parameters))==0;
    }
    public async Task<long> GetProductCountByProductType(Guid productTypeId,Guid? id=null)
    {
        var parameters = new DynamicParameters();
        parameters.Add("@productTypeId", productTypeId);
        var sql = "Select COUNT(1) as [Count] from product.Product where ProductTypeId=@productTypeId";
        if (id != null)
        {
            parameters.Add("@id", id);
            sql += " AND Id<>@id";
        }
        return await SingleCountAsync(sql, parameters);
    }
}
