using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APKBuilder.IServices
{
    public interface IFileManager
    {
        string GetContentType(string path);
         Task CleanResidual(string oPath);
    }
}
