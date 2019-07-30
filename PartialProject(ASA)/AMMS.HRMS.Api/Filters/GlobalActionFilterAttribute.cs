using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http.Filters;
using AMMS.Logger.Services;

namespace AMMS.HRMS.Api.Filters
{
    public class GlobalActionFilterAttribute : ActionFilterAttribute
    {
        public override async void OnActionExecuted(HttpActionExecutedContext context)
        {
            IEnumerable<string> apiHeader;
            var logCondition = context.ActionContext.ControllerContext.Request.Headers.TryGetValues("Log", out apiHeader);
            if (!Convert.ToBoolean(logCondition)) return;
            if (!Convert.ToBoolean(apiHeader.FirstOrDefault())) return;
#pragma warning disable 4014
            new LoggerService().LogInfo($"user: " +
#pragma warning restore 4014
                $"{context.ActionContext.ControllerContext.Request.Headers.GetValues("User").FirstOrDefault()}, " +
                $"Accessed : {string.Join("", context.ActionContext.ControllerContext.Request.RequestUri.Segments)}");
        }
    }
}