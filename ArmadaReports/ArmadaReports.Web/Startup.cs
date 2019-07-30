using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ArmadaReports.Web.Startup))]
namespace ArmadaReports.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
