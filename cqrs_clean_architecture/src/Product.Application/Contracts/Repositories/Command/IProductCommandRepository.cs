using Product.Application.Contracts.Repositories.Command.Base;
namespace Product.Application.Contracts.Repositories.Command;
public interface IProductCommandRepository : ICommandRepository<Core.Entities.Product>
{
    Task<Core.Entities.Product> Get(Guid id);
    //Task<Core.Entities.Product> Add(Core.Entities.Product product);
    //Task<Core.Entities.Product> Update(Core.Entities.Product product);
}
