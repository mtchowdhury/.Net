using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RabbitConsumer.IServices
{
   public interface IFileManager
    {
        string GetContentType(string path);
        Task CleanResidual(string oPath);

    }
}
