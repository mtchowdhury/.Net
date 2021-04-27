using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RabbitConsumer.IServices;

namespace RabbitConsumer.Services
{
    public class FileManager: IFileManager
    {
        public async Task CleanResidual(string oPath)
        {
            try
            {
                var outputPath = oPath;
                var list = Directory.GetDirectories(outputPath);
                var deleteList = list.Where(x =>
                    x != outputPath + "\\" + DateTime.Now.ToString(AppConstants.AppConstants.DATE_FORMAT) && x != outputPath + "\\" + DateTime.Now.AddDays(-1).ToString(AppConstants.AppConstants.DATE_FORMAT)).ToList();
                foreach (var path in deleteList)
                {
                    Directory.Delete(path, true);
                }
            }
            catch (Exception e)
            {
                //add logger here
                throw;
            }
        }

        public string GetContentType(string path)
        {
            var types = GetMimeTypes();
            var ext = Path.GetExtension(path).ToLowerInvariant();
            return types[ext];
        }

        private Dictionary<string, string> GetMimeTypes()
        {
            return new Dictionary<string, string>
            {
                {".txt", "text/plain"},
                {".pdf", "application/pdf"},
                {".doc", "application/vnd.ms-word"},
                {".docx", "application/vnd.ms-word"},
                {".xls", "application/vnd.ms-excel"},
                {".xlsx", "application/vnd.openxmlformats officedocument.spreadsheetml.sheet"},
                {".png", "image/png"},
                {".jpg", "image/jpeg"},
                {".jpeg", "image/jpeg"},
                {".gif", "image/gif"},
                {".apk", "application/vnd.android.package-archive"},
                {".csv", "text/csv"}
            };
        }
    }
}
