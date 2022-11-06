using Product.Application.Contracts.Repositories.Command;
using Product.Infrastructure.Persistence;
using Product.Infrastructure.Repository.Command.Base;

namespace Product.Infrastructure.Repository.Command;
public class ProductCommandRepository : CommandRepository<Core.Entities.Product>, IProductCommandRepository
{
    public ProductCommandRepository(DbFactory dbFactory) : base(dbFactory)
    {
    }

    public async Task<Core.Entities.Product> Get(Guid id)
    {
        return await GetAsync(id);
    }

    //public async Task<Core.Entities.Product> Add(Core.Entities.Product product)
    //{
    //    return await InsertAsync(product);
    //}

    //public async Task<Core.Entities.Product> Update(Core.Entities.Product product)
    //{
    //    return await UpdateAsync(product);
    //}
}
