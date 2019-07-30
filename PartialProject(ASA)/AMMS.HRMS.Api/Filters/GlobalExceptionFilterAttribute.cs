using System.Linq;
using System.Web.Http.Filters;
using AMMS.Logger.Services;

namespace AMMS.HRMS.Api.Filters
{
    public class GlobalExceptionFilterAttribute:ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext context)
        {
#pragma warning disable 4014
            //new LoggerService().LogError($"user: {context.ActionContext.ControllerContext.Request.Headers.GetValues("User").FirstOrDefault()}, " + $"Exception : {context.Exception.Message}");
#pragma warning restore 4014
        }
    }
}