using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using APKBuilder.IServices;

namespace APKBuilder.Services
{
    public class AndroidBuildManager : IAndroidBuildManager
    {
        private string _exe;
        private string _outputPath;

        public AndroidBuildManager(string exe, string outputPath)
        {
            _exe = exe;
            _outputPath = outputPath;
        }
        public bool Build(string env, string entity, string path, string guid, out string output, out string error, out string outPath)
        {
            var postFix = string.Empty;
            var arguments = GetArguments(env, entity, out postFix);
            output = error = outPath =string.Empty;
            try
            {
                Directory.SetCurrentDirectory(path);
                ProcessStartInfo droidInfo = new ProcessStartInfo();
                droidInfo.CreateNoWindow = true;
                droidInfo.RedirectStandardError = true;
                droidInfo.RedirectStandardOutput = true;
                droidInfo.RedirectStandardInput = true;
                droidInfo.UseShellExecute = false;
                droidInfo.FileName = _exe;

                Process droidProcess = new Process();
                droidProcess.StartInfo = droidInfo;
                droidProcess.Start();
                using (StreamWriter sw = droidProcess.StandardInput)
                {
                    if (sw.BaseStream.CanWrite)
                    {
                        sw.WriteLine(arguments);
                    }
                }
                output = droidProcess.StandardOutput.ReadToEnd(); // pick up STDOUT
                droidProcess.WaitForExit();
                droidProcess.Close();
                //copy to output directory 
                var midFix = AppConstants.AppConstants.MID_FIX;
                var fileName = AppConstants.AppConstants.APP + postFix + AppConstants.AppConstants.APK; 
                outPath = _outputPath + "\\" + DateTime.Now.ToString(AppConstants.AppConstants.DATE_FORMAT) + "\\" +guid;  
                CopyApkToTargetDirectory(path + midFix + postFix, outPath, fileName);
                outPath += "\\" + fileName;
                return true;
            }
            catch (Exception exception)
            {
                error = exception.Message;
                return false;
            }
        }

        private static string GetArguments(string env, string entity, out string postFix)
        {
            var args = AppConstants.AppConstants.BUILD_ARGS;
            postFix = string.Empty;
            if (env == AppConstants.AppConstants.ENV_QA || env == AppConstants.AppConstants.ENV_DEV || env == AppConstants.AppConstants.ENV_DEBUG)
            {
                postFix = env;
            }
            else
            {
                postFix = entity + env;
            }
            args += postFix;
            return args;
        }

        private static void CopyApkToTargetDirectory(string sourcePath, string outputPath, string fileName)
        {
            try
            {
                if (!Directory.Exists(outputPath))
                {
                    Directory.CreateDirectory(outputPath);
                }
                if (Directory.Exists(sourcePath) && Directory.Exists(outputPath))
                    File.Copy(sourcePath + @"\" + fileName, outputPath + @"\" + fileName, true);
            }
            catch (Exception e)
            {
                //Console.WriteLine(e);
                throw;
            }

        }
    }
}
