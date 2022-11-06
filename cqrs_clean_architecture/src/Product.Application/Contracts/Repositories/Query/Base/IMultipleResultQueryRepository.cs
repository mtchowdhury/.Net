using Dapper;

namespace Product.Application.Contracts.Repositories.Query.Base
{
    public interface IMultipleResultQueryRepository<TEntity>: IQueryRepository<TEntity> where TEntity : class 
    {
       
        Task<(long, IEnumerable<TEntity>)> GetMultipleResultAsync(string sql, DynamicParameters parameters, bool isProcedure = false);

        /// <summary>
        /// Get multiple result reponse using SQL Query or Procedure with dapper parameters from single entity
        ///
        /// </summary>
        /// <typeparam name="TEntity"></typeparam>
        /// <param name="parameters"></param>
        /// <param name="sql"></param>
        /// <param name="map"></param>
        /// <param name="isProcedure"></param>
        /// <returns></returns>
    }
}
