using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(AMMS.Web.Startup))]
namespace AMMS.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
