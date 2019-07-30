using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace ArmadaReports.Web
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "First",
                url: "",
                defaults: new { controller = "Home", action = "Auth" }
            );

            routes.MapRoute(
                name: "Second",
                url: "{path}",
                defaults: new { controller = "Home", action = "Auth" }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Auth", id = UrlParameter.Optional }
            );
        }
    }
}
