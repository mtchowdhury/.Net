using Product.Infrastructure.Configs;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System.Data;
using System.Data.SqlClient;

namespace Product.Infrastructure.Persistence
{
    public class DbConnector
    {
        private readonly IConfiguration _configuration;
        private readonly ProductSettings _settings;
        protected DbConnector(IConfiguration configuration, IOptions<ProductSettings> settings)
        {
            _configuration = configuration;
            _settings = settings.Value;
        }

        public IDbConnection CreateConnection()
        {
            //string _connectionString = _configuration.GetConnectionString("HRMConnection");
            string _connectionString = _settings.ConnectionStrings.ProductDbConnection;
            return new SqlConnection(_connectionString);
        }
    }
}
