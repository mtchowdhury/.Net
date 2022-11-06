using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AMBS.Conso.Gateway.NL.Helper
{
    public class LogHelper
    {
        public enum LogLevel
        {
            Information=1,
            Error = 2,
            Warning = 3
        }
        public static void Log(string message, string methodBase,LogLevel level)
        {
            var formattedMsg = string.Empty;
            formattedMsg = " Invoker: " + methodBase + "; Message: " + message;
            switch (level)
            {
                case LogLevel.Error:
                    Serilog.Log.Error(formattedMsg);
                    break;
                case LogLevel.Information:
                    Serilog.Log.Information(formattedMsg);
                    break;
                case LogLevel.Warning:
                    Serilog.Log.Warning(formattedMsg);
                    break;
            }
            
        }
    }
}
