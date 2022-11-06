using MassTransit;
using Steeltoe.Discovery.Client;
using Steeltoe.Discovery.Eureka;

namespace Product.API.Extensions
{
    public static class ServiceExtension
    {
        /// <summary>
        /// Configure MassTransit with RabbitMQ
        /// </summary>
        /// <param name="services"></param>
        /// <param name="configuration"></param>
        public static void ConfigureMassTransit(this IServiceCollection services, IConfiguration configuration)
        {
            if (Convert.ToBoolean(configuration["RabbitMq:IsActive"]))
            {
                services.AddMassTransit(options =>
                {
                    //options.AddConsumer<BranchCreateConsumer>();

                    options.UsingRabbitMq((context, cfg) =>
                    {
                        cfg.Host(new Uri(configuration["RabbitMQ:Uri"]), hst =>
                        {
                            hst.Username(configuration["RabbitMQ:UserName"]);
                            hst.Password(configuration["RabbitMQ:Password"]);
                        });

                        cfg.ConfigureEndpoints(context);

                    });
                });
            }

        }

        /// <summary>
        /// Eureka as Service Discovery configuration (if needed)
        /// </summary>
        /// <param name="services"></param>
        /// <param name="configuration"></param>
        public static void ConfigureEureka(this IServiceCollection services, IConfiguration configuration)
        {
            bool isEurekaActive = Convert.ToBoolean(configuration["Eureka:Active"]);
            if (isEurekaActive)
            {
                services.AddServiceDiscovery(o => o.UseEureka());
            }
        }
    }
}
