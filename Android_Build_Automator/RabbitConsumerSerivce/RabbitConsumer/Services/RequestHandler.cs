using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RabbitConsumer.IServices;

namespace RabbitConsumer.Services
{
   public class RequestHandler
    {
        private readonly IAndroidBuildManager _androidBuildManager;
        private readonly IGitCommandManager _gitCommandManager;
        private readonly INotifier _notifier;

        public RequestHandler()
        {
            _androidBuildManager = new AndroidBuildManager(ConfigurationManager.AppSettings["CMDEXE"], ConfigurationManager.AppSettings["OutputPath"]);
            _gitCommandManager =
                new GitCommandManager(ConfigurationManager.AppSettings["GitExepath"], ConfigurationManager.AppSettings["WorkingDirectory"]);
            _notifier = new Notifier();
        }

        public void BuildRequestedAPK(string env, string entity, string gitBranch, string hash)
        {
            var outStr = string.Empty;
            var errorStr = string.Empty;
            var outpath = string.Empty;
            var isPulled = _gitCommandManager.Pull(ConfigurationManager.AppSettings["GitPullCommand"] + gitBranch, out outStr, out errorStr);
            if (!isPulled)
            {
                _notifier.SendMessage(hash, AppConstants.AppConstants.FAILED, errorStr);
                return;
            }
            var isBuilt = _androidBuildManager.Build(env, entity, ConfigurationManager.AppSettings["WorkingDirectory"], hash,
                out errorStr, out errorStr, out outpath);
            if (!isBuilt || !System.IO.File.Exists(outpath))
            {
                _notifier.SendMessage(hash, AppConstants.AppConstants.FAILED, errorStr);
            }
            else
            {
                _notifier.SendMessage(hash, AppConstants.AppConstants.SUCCESSFUL, path: outpath);
            }
        }

        public void CleanResidual()
        {
            new FileManager().CleanResidual(ConfigurationManager.AppSettings["OutputPath"]);
        }
    }
}
