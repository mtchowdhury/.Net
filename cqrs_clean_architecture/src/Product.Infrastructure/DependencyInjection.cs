using Product.Application.Contracts.Repositories;
using Product.Application.Contracts.Repositories.Command;
using Product.Application.Contracts.Repositories.Command.Base;
using Product.Application.Contracts.Repositories.Query;
using Product.Application.Contracts.Repositories.Query.Base;
using Product.Infrastructure.Configs;
using Product.Infrastructure.Persistence;
using Product.Infrastructure.Repository;
using Product.Infrastructure.Repository.Command;
using Product.Infrastructure.Repository.Command.Base;
using Product.Infrastructure.Repository.Query;
using Product.Infrastructure.Repository.Query.Base;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Product.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<ProductSettings>(configuration);
            var serviceProvider = services.BuildServiceProvider();
            var opt = serviceProvider.GetRequiredService<IOptions<ProductSettings>>().Value;

            // For SQLServer Connection
            services.AddDbContext<ProductDbContext>(options =>
            {
                options.UseSqlServer(
                    //Configuration.GetConnectionString("HRMConnection"),
                    opt.ConnectionStrings.ProductDbConnection,
                    sqlServerOptionsAction: sqlOptions =>
                    {
                        //sqlOptions.MigrationsAssembly(typeof(AdminContext).GetTypeInfo().Assembly.GetName().Name);
                        //sqlOptions.EnableRetryOnFailure(maxRetryCount: 15, maxRetryDelay: TimeSpan.FromSeconds(30), errorNumbersToAdd: null);
                    });
            });


            services.AddScoped(typeof(IQueryRepository<>), typeof(QueryRepository<>));
            services.AddScoped(typeof(IMultipleResultQueryRepository<>), typeof(MultipleResultQueryRepository<>));
            services.AddScoped(typeof(ICommandRepository<>), typeof(CommandRepository<>));
            services.AddTransient<IUnitOfWork, UnitOfWork>();
            services.AddScoped<Func<ProductDbContext>>((provider) => provider.GetService<ProductDbContext>);
            services.AddScoped<DbFactory>();

            services.AddRepositories();

            return services;
        }

        private static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            services.AddScoped<IProductCommandRepository, ProductCommandRepository>();
            services.AddScoped<IProductQueryRepository, ProductQueryRepository>();
            services.AddScoped<IProductListQueryRepository, ProductListQueryRepository>();
           
            return services;
        }
    }
}
