using System;

namespace ArmadaReports.Logger.Service
{
    public interface ILoggerService
    {
        void LogInfo(string message);
        void LogError(string message, Exception exception);
        void LogError(string message);
        void LogWarning(string message);
    }
}
