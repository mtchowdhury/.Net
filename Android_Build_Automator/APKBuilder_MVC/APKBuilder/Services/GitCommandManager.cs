using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using APKBuilder.IServices;
using Microsoft.Extensions.Logging;

namespace APKBuilder.Services
{
    public class GitCommandManager: IGitCommandManager
    {
        private string _exe;
        private string _workingDirectory;

        public GitCommandManager(string exe, string workingDirectory)
        {
            _exe = exe;
            _workingDirectory = workingDirectory;
        }

        public bool Pull(string command, out string output, out string error, ILogger _logger)
        {
            output = error = string.Empty;
            var ouch = string.Empty;
            var euch = string.Empty;

            try
            {
                ProcessStartInfo gitInfo = new ProcessStartInfo();
                gitInfo.CreateNoWindow = true;
                gitInfo.RedirectStandardError = true;
                gitInfo.RedirectStandardOutput = true;
                gitInfo.UseShellExecute = false;
               // gitInfo.FileName = _exe;
                gitInfo.FileName = "git.exe";

                Process gitProcess = new Process();
                _logger.LogInformation("command: " + command);
                gitInfo.Arguments =   command;
                gitInfo.WorkingDirectory = _workingDirectory;
                _logger.LogInformation("working directory: " + _workingDirectory);

                gitProcess.StartInfo = gitInfo;
                _logger.LogInformation("b4 process start");
                gitProcess.Start();
                _logger.LogInformation("now i read");
                error = gitProcess.StandardError.ReadToEnd();  // pick up STDERR
                output = gitProcess.StandardOutput.ReadToEnd(); // pick up STDOUT
                _logger.LogInformation("error: " +error);
                _logger.LogInformation("output: " + output);
                if (!string.IsNullOrEmpty(error) && output.Trim() != "Already up to date.")
                    return false;


                gitProcess.WaitForExit();
                gitProcess.Close();

                return true;
                //ProcessStartInfo gitInfo = new ProcessStartInfo();
                //gitInfo.CreateNoWindow = true;
                //gitInfo.RedirectStandardError = true;
                //gitInfo.RedirectStandardOutput = true;
                //gitInfo.RedirectStandardInput = true;
                //gitInfo.UseShellExecute = false;
                ////gitInfo.FileName = _exe;
                //gitInfo.FileName = "cmd.exe";

                //Process gitProcess = new Process();
                //gitInfo.Arguments = command;
                //gitInfo.WorkingDirectory = _workingDirectory;

                //gitProcess.StartInfo = gitInfo;
                //_logger.LogInformation("b4 process start");
                //gitProcess.Start();




                ////gitProcess.WaitForExit();

                //gitProcess.StandardInput.WriteLine("echo tyco");
                //gitProcess.StandardInput.Flush();
                //gitProcess.StandardInput.Close();
                //_logger.LogInformation("b4 wait");
                //gitProcess.WaitForExit();
                //_logger.LogInformation("now i read");
                //error = gitProcess.StandardError.ReadToEnd();  // pick up STDERR
                //output = gitProcess.StandardOutput.ReadToEnd(); // pick up STDOUT
                //if (!string.IsNullOrEmpty(error) && output.Trim() != "Already up to date.")
                //    return false;
                //_logger.LogInformation("erro: " + error);
                //_logger.LogInformation("output: " + output);
                //_logger.LogInformation("going to close");
                //gitProcess.Close();
                //return true;
                //_logger.LogInformation("i just got into git manager");
                //ProcessStartInfo gitInfo = new ProcessStartInfo();
                //gitInfo.CreateNoWindow = true;
                //gitInfo.RedirectStandardError = true;
                //gitInfo.RedirectStandardOutput = true;
                //gitInfo.UseShellExecute = false;
                ////gitInfo.FileName = _exe;
                //gitInfo.FileName = "cmd.exe";
                //_logger.LogInformation("almost there");
                //Process gitProcess = new Process();
                ////gitInfo.Arguments = command;
                //gitInfo.Arguments = "echo hi";
                //gitInfo.WorkingDirectory = _workingDirectory;

                //gitProcess.StartInfo = gitInfo;
                //_logger.LogInformation("all set now im gonna start process");

                //output += gitProcess.StandardOutput.ReadLine();
                //error += gitProcess.StandardError.ReadLine();
                //gitProcess.Start();
                //_logger.LogInformation("now i will write the error & output");
                //_logger.LogInformation("b4 wait");
                //gitProcess.WaitForExit();
                //_logger.LogInformation("after wait");
                //gitProcess.Close();
                //return true;
                //using (AutoResetEvent outputWaitHandle = new AutoResetEvent(false))
                //using (AutoResetEvent errorWaitHandle = new AutoResetEvent(false))
                //{
                //    gitProcess.OutputDataReceived += (sender, e) =>
                //    {
                //        if (e.Data == null)
                //        {
                //            outputWaitHandle.Set();
                //        }
                //        else
                //        {
                //            ouch += e.Data;
                //        }
                //    };
                //    gitProcess.ErrorDataReceived += (sender, e) =>
                //    {
                //        if (e.Data == null)
                //        {
                //            errorWaitHandle.Set();
                //        }
                //        else
                //        {
                //            euch += e.Data;
                //        }
                //    };

                //    gitProcess.Start();
                //    _logger.LogInformation("now i will write the error & output");

                //    //while ( gitProcess.StandardOutput.Peek() > -1)
                //    //{
                //    //    _logger.LogInformation("now i am inside peek & peek is " + gitProcess.StandardOutput.Peek());
                //    //    output +=gitProcess.StandardOutput.ReadLine();
                //    //}

                //    //while (gitProcess.StandardError.Peek() > -1)
                //    //{
                //    //    error+= gitProcess.StandardError.ReadLine();
                //    //}
                //    //error = gitProcess.StandardError.ReadToEnd();  // pick up STDERR
                //    //output = gitProcess.StandardOutput.ReadToEnd(); // pick up STDOUT
                //    _logger.LogInformation("output " + ouch);
                //    _logger.LogInformation("error " + euch);

                //    if (!string.IsNullOrEmpty(error) && output.Trim() != "Already up to date.")
                //        return false;

                //    _logger.LogInformation("b4 wait");
                //    gitProcess.WaitForExit();
                //    _logger.LogInformation("after wait");
                //    gitProcess.Close();

                //    return true;
                //}
            }
            catch (Exception exception)
            {
                error = exception.Message;
                _logger.LogInformation("here''s the exception: " + exception.Message);
                return false;
            }
        }
    }
}
