namespace Product.Application.Contracts
{
    public interface ICurrentUserService
    {
        Guid? UserId { get; }
    }
}
