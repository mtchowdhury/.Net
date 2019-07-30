using System;
using System.Configuration;
using System.Web.Http;
using System.Web.Http.Cors;
using AMMS.HRMS.Api.DI;
using AMMS.HRMS.Api.Filters;
using AMMS.HRMS.Service.Interfaces.Employee;
using AMMS.HRMS.Service.Services.Employee;
using AMMS.Service.Interfaces;
using AMMS.Service.Interfaces.Filter;
using AMMS.Service.Services;
using AMMS.Service.Services.Filter;
using Microsoft.Owin.Security.OAuth;
using Microsoft.Practices.Unity;
using Newtonsoft.Json;

namespace AMMS.HRMS.Api
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.EnableCors(new EnableCorsAttribute("*", "*", "*"));
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));
            config.Filters.Add(new GlobalExceptionFilterAttribute());
            config.Filters.Add(new GlobalActionFilterAttribute());

            var json = config.Formatters.JsonFormatter;
            json.SerializerSettings.PreserveReferencesHandling = PreserveReferencesHandling.Objects;
            config.Formatters.Remove(config.Formatters.XmlFormatter);

            //var connectionString = DecryptConnectionString();

            var container = new UnityContainer();
            container.RegisterType<IEmployeeService, EmployeeService>(
                new InjectionConstructor(ConfigurationManager.ConnectionStrings["AMMSConnection"].ConnectionString, 
                ConfigurationManager.AppSettings["redisHost"], Convert.ToInt32(ConfigurationManager.AppSettings["redisTimeout"])));
            container.RegisterType<IEmployeeBankAccountService, EmployeeBankAccountService>(
                new InjectionConstructor(ConfigurationManager.ConnectionStrings["AMMSConnection"].ConnectionString
                 ));

            container.RegisterType<IFilterService, FilterService>(
               new InjectionConstructor(ConfigurationManager.ConnectionStrings["AMMSConnection"].ConnectionString, ConfigurationManager.AppSettings["redisHost"],
               Convert.ToInt32(ConfigurationManager.AppSettings["redisTimeout"]), ConfigurationManager.AppSettings["environment"]));
            container.RegisterType<IEmployeeDesignationService, EmployeeDesignationService>(
               new InjectionConstructor(ConfigurationManager.ConnectionStrings["AMMSConnection"].ConnectionString,
               ConfigurationManager.AppSettings["redisHost"], Convert.ToInt32(ConfigurationManager.AppSettings["redisTimeout"])));
            container.RegisterType<IGradeAndDesignationService, GradeAndDesignationService>(
                new InjectionConstructor(ConfigurationManager.ConnectionStrings["AMMSConnection"].ConnectionString
                ));
            container.RegisterType<IEmployeeAccountService, EmployeeAccountService>(
                new InjectionConstructor(ConfigurationManager.ConnectionStrings["AMMSConnection"].ConnectionString
                ));
            container.RegisterType<IEmployeeReleaseService, EmployeeReleaseService>(
               new InjectionConstructor(ConfigurationManager.ConnectionStrings["AMMSConnection"].ConnectionString
               ));
            container.RegisterType<IHrmTransactionService, HrmTransactionService>(
               new InjectionConstructor(ConfigurationManager.ConnectionStrings["AMMSConnection"].ConnectionString
               ));
            container.RegisterType<ISalaryStructureService, SalaryStructureService>(
               new InjectionConstructor(ConfigurationManager.ConnectionStrings["AMMSConnection"].ConnectionString
               ));
            container.RegisterType<IEmployeeTransferService,EmployeeTransferService>(
               new InjectionConstructor(ConfigurationManager.ConnectionStrings["AMMSConnection"].ConnectionString
               ));
            container.RegisterType<IPaySalaryService, PaySalaryService>(
               new InjectionConstructor(ConfigurationManager.ConnectionStrings["AMMSConnection"].ConnectionString
               ));
            container.RegisterType<IInvalidateCacheService, InvalidateCacheService>();             

            config.DependencyResolver = new UnityResolver(container);

            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute("DefaultApi", "api/{controller}/{action}/{id}", new { id = RouteParameter.Optional }
            );
        }

        private static string DecryptConnectionString(string connectionName = "AMMSConnection")
        {
            return new Encryption.Encryption(AMMS.Common.Globals.SecurityConfig.KEY, AMMS.Common.Globals.SecurityConfig.IV)
                .DecryptConnectionString(ConfigurationManager.ConnectionStrings[connectionName].ConnectionString);
        }
    }
}
