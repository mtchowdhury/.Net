using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RabbitConsumer.AppConstants
{
    public class AppConstants
    {
        public const string FAILED = "failed";
        public const string SUCCESSFUL = "successful";
        public const string FILE_NOT_FOUND = "file not found!";
        public const string MID_FIX = @"\app\build\outputs\apk\";
        public const string APP = "app-";
        public const string APK = ".apk";
        public const string BUILD_ARGS = " gradlew.bat assemble";
        public const string ENV_QA = "qa";
        public const string ENV_DEV = "dev";
        public const string ENV_DEBUG = "debug";
        public const string DATE_FORMAT = "yyyy-MM-dd";
        public const string RECEIVE_MESSAGE = "ReceiveMessage";
    }
}
