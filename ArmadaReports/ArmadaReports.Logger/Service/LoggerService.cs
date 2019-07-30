using System;
using System.Reflection;
using log4net;

namespace ArmadaReports.Logger.Service
{
    public class LoggerService: ILoggerService
    {
        private readonly ILog _logger;
        public LoggerService()
        {
            log4net.Config.XmlConfigurator.Configure();
            _logger = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType);
        }

        public void LogError(string message, Exception exception)
        {
            _logger.Error(message, exception);
        }

        public void LogError(string message)
        {
            _logger.Error(message);
        }

        public void LogInfo(string message)
        {
            _logger.Info(message);
        }

        public void LogWarning(string message)
        {
            _logger.Warn(message);
        }
    }
}
