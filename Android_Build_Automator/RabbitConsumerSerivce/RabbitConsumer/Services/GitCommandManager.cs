using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RabbitConsumer.IServices;

namespace RabbitConsumer.Services
{
    class GitCommandManager: IGitCommandManager
    {
        private string _exe;
        private string _workingDirectory;

        public GitCommandManager(string exe, string workingDirectory)
        {
            _exe = exe;
            _workingDirectory = workingDirectory;
        }

        public bool Pull(string command, out string output, out string error)
        {
            output = error = string.Empty;

            try
            {
                ProcessStartInfo gitInfo = new ProcessStartInfo();
                gitInfo.CreateNoWindow = true;
                gitInfo.RedirectStandardError = true;
                gitInfo.RedirectStandardOutput = true;
                gitInfo.UseShellExecute = false;
                gitInfo.FileName = _exe;

                Process gitProcess = new Process();
                gitInfo.Arguments = command;
                gitInfo.WorkingDirectory = _workingDirectory;

                gitProcess.StartInfo = gitInfo;
                gitProcess.Start();

                error = gitProcess.StandardError.ReadToEnd();  // pick up STDERR
                output = gitProcess.StandardOutput.ReadToEnd(); // pick up STDOUT
                if (!string.IsNullOrEmpty(error) && output.Trim() != "Already up to date.")
                    return false;


                gitProcess.WaitForExit();
                gitProcess.Close();

                return true;
            }
            catch (Exception exception)
            {
                error = exception.Message;
                return false;
            }
        }
    }
}
