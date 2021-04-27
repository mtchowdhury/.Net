using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APKBuilder.IServices
{
   public interface IAndroidBuildManager
    {
        bool Build(string env, string entity, string path, string guid, out string output, out string error, out string outPath);
    }
}
