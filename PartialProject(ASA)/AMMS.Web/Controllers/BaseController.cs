using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;
using AMMS.Logger.Interfaces;

namespace AMMS.Web.Controllers
{
    public class BaseController : Controller
    {
        private readonly ILoggerService _loggerService;

        public BaseController(ILoggerService loggerService)
        {
            _loggerService = loggerService;
        }

        protected virtual bool OnError(string actionName, MethodInfo methodInfo, Exception exception)
        {
            _loggerService.LogInfo($"Exception : {exception}, MethodInfo : {methodInfo}, actionName: {actionName}");
            return false;
        }
    }
}