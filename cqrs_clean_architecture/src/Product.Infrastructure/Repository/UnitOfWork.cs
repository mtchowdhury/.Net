using Product.Application.Contracts;
using Product.Application.Contracts.Repositories;
using Product.Core.Entities.Base;
using Product.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Product.Infrastructure.Repository
{
    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        private readonly DbFactory _dbFactory;
        private readonly ICurrentUserService _currentUserService;

        public UnitOfWork(DbFactory dbFactory, ICurrentUserService currentUserService)
        {
            _dbFactory = dbFactory;
            _currentUserService = currentUserService;
        }

        public async Task<int> CommitAsync()
        {
            await using var transaction = await _dbFactory.DbContext.Database.BeginTransactionAsync();
            try
            {
                foreach (var entry in _dbFactory.DbContext.ChangeTracker.Entries<BaseEntity<Guid>>())
                {
                    switch (entry.State)
                    {
                        case EntityState.Added:
                            {
                               
                                entry.Entity.CreatedBy = Guid.NewGuid();
                                entry.Entity.CreatedDate = DateTime.Now;
                                break;
                            }
                        case EntityState.Modified:
                            {
                                entry.Entity.LastModifiedBy = Guid.NewGuid();
                                entry.Entity.LastModifiedDate = DateTime.Now;
                                break;
                            }
                        case EntityState.Deleted:
                            break;
                    }
                }
                var affectedRows = await _dbFactory.DbContext.SaveChangesAsync();
                await transaction.CommitAsync();
                return affectedRows;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw;
            }
            finally
            {
                await _dbFactory.DbContext.Database.CloseConnectionAsync();
                await _dbFactory.DbContext.DisposeAsync();
            }
        }

        public void Dispose()
        {
            _dbFactory?.Dispose();
            GC.SuppressFinalize(this);
        }
    }
}
