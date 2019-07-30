using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace AMMS.Web.Models
{
    public class SubDomainRoute:RouteBase
    {
       
            private readonly string _subDomain;
            private readonly RouteValueDictionary _routeData;

            public SubDomainRoute(string subDomain, object routeData) :
                this(subDomain, new RouteValueDictionary(routeData))
            { }

            public SubDomainRoute(string subDomain, RouteValueDictionary routeData)
            {
                _subDomain = subDomain;
                _routeData = routeData;
            }

            public override RouteData GetRouteData(HttpContextBase httpContext)
            {
                var url = httpContext.Request.Headers["HOST"];

                var index = url.IndexOf(".", StringComparison.Ordinal);
                if (index < 0) return null;

                var firstDomain = url.Split('.')[0];
                if ((firstDomain.Equals("www") || firstDomain.Equals("localhost"))
                    && !firstDomain.Equals(_subDomain))
                    return null;

                var handler = new MvcRouteHandler();
                var result = new RouteData { RouteHandler = handler };
                foreach (var route in _routeData)
                {
                    result.Values.Add(route.Key, route.Value);
                }

                return result;
            }

            public override VirtualPathData GetVirtualPath(RequestContext requestContext, RouteValueDictionary values)
            {
                return null;
            }
    }
}